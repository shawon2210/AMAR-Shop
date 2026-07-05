import { Injectable } from '@nestjs/common';

@Injectable()
export class BarcodeService {
  generateBarcode(data: string): string {
    const checksum =
      data.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 100;
    return `BAR-${data}-${String(checksum).padStart(2, '0')}`;
  }

  parseBarcode(scan: string): { type: string; id: string; checksum: string } {
    const parts = scan.split('-');
    if (parts.length < 3) throw new Error('Invalid barcode format');
    return {
      type: parts[0],
      id: parts.slice(1, -1).join('-'),
      checksum: parts[parts.length - 1],
    };
  }

  generateQR(data: string): string {
    return `QR:${Buffer.from(data).toString('base64')}`;
  }

  validateScan(itemId: string, barcode: string): boolean {
    try {
      const parsed = this.parseBarcode(barcode);
      return parsed.id === itemId;
    } catch {
      return false;
    }
  }
}
