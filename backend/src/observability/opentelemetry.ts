import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

export function setupObservability() {
  const endpoint =
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT ||
    process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ||
    'http://localhost:4318/v1/traces';

  const traceExporter = new OTLPTraceExporter({ url: endpoint });

  const metricReader = new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url:
        process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT ||
        process.env.OTEL_EXPORTER_OTLP_ENDPOINT ||
        'http://localhost:4318/v1/metrics',
    }),
    exportIntervalMillis: 60000,
  });

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [SemanticResourceAttributes.SERVICE_NAME]: 'amarshop-api',
      [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
    }),
    traceExporter,
    metricReader,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();
  return sdk;
}
