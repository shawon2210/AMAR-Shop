import { v4 as uuidv4 } from 'uuid';

interface DomainEvent {
  id: string;
  streamId: string;
  type: string;
  data: Record<string, unknown>;
  metadata: {
    version: number;
    timestamp: Date;
    correlationId?: string;
    causationId?: string;
    userId?: string;
  };
}

interface Snapshot {
  streamId: string;
  version: number;
  state: Record<string, unknown>;
  createdAt: Date;
}

interface EventStore {
  events: DomainEvent[];
  snapshots: Snapshot[];
}

const store: EventStore = {
  events: [],
  snapshots: [],
};

export async function appendEvent(
  streamId: string,
  event: Omit<DomainEvent, 'id' | 'metadata'> & { metadata?: Partial<DomainEvent['metadata']> },
): Promise<DomainEvent> {
  const existingEvents = store.events.filter((e) => e.streamId === streamId);
  const version = existingEvents.length + 1;

  const domainEvent: DomainEvent = {
    id: uuidv4(),
    streamId: event.streamId,
    type: event.type,
    data: event.data,
    metadata: {
      version,
      timestamp: new Date(),
      ...event.metadata,
    },
  };

  store.events.push(domainEvent);

  if (version % 10 === 0) {
    await createSnapshot(streamId, {});
  }

  return domainEvent;
}

export async function getEvents(
  streamId: string,
  options?: { fromVersion?: number; toVersion?: number },
): Promise<DomainEvent[]> {
  let events = store.events.filter((e) => e.streamId === streamId);

  if (options?.fromVersion) {
    events = events.filter((e) => e.metadata.version >= options.fromVersion!);
  }
  if (options?.toVersion) {
    events = events.filter((e) => e.metadata.version <= options.toVersion!);
  }

  return events.sort((a, b) => a.metadata.version - b.metadata.version);
}

export async function replayEvents<T>(
  streamId: string,
  handler: (state: T, event: DomainEvent) => T,
  initialState: T,
): Promise<T> {
  const snapshot = await getSnapshot(streamId);
  let state = snapshot ? (snapshot.state as T) : initialState;
  const fromVersion = snapshot ? snapshot.version + 1 : 1;

  const events = await getEvents(streamId, { fromVersion });

  for (const event of events) {
    state = handler(state, event);
  }

  return state;
}

export async function getSnapshot(streamId: string): Promise<Snapshot | null> {
  const snapshots = store.snapshots
    .filter((s) => s.streamId === streamId)
    .sort((a, b) => b.version - a.version);

  return snapshots[0] || null;
}

export async function createSnapshot(
  streamId: string,
  state: Record<string, unknown>,
): Promise<Snapshot> {
  const events = store.events.filter((e) => e.streamId === streamId);
  const version = events.length;

  const snapshot: Snapshot = {
    streamId,
    version,
    state,
    createdAt: new Date(),
  };

  store.snapshots.push(snapshot);
  return snapshot;
}

export async function getEventStreamStats(): Promise<{
  totalEvents: number;
  totalStreams: number;
  totalSnapshots: number;
}> {
  const uniqueStreams = new Set(store.events.map((e) => e.streamId));
  return {
    totalEvents: store.events.length,
    totalStreams: uniqueStreams.size,
    totalSnapshots: store.snapshots.length,
  };
}
