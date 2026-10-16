import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const exportToExcel = async (
  data: any[],
  filename: string,
  sheetName: string = 'Data'
) => {
  if (!data || data.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName, {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
  });

  const columnKeys = Object.keys(data[0]);
  const columns = columnKeys.map((key) => ({
    header: key,
    key: key,
    width: 25,
  }));
  worksheet.columns = columns;

  data.forEach((item) => {
    worksheet.addRow(item);
  });

  // Identify column keys for IP Hit Count, Total Hits, and IP Address
  const hitCountColKeys = new Set<string>();
  const ipAddressColKeys = new Set<string>();

  columnKeys.forEach((key) => {
    const lower = key.toLowerCase().trim();
    if (
      lower === 'ip hit count' ||
      lower === 'total hits' ||
      lower === 'hit count' ||
      lower === 'hits'
    ) {
      hitCountColKeys.add(key);
    } else if (lower === 'ip address' || lower === 'ip') {
      ipAddressColKeys.add(key);
    }
  });

  // Header Row Styling (Dark Navy/Slate with crisp white bold text)
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11, name: 'Calibri' };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0F172A' },
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
  headerRow.height = 32;

  // Format all data rows
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    row.height = 36;
    row.alignment = { vertical: 'middle', wrapText: true };

    // Format each cell in the row
    columnKeys.forEach((key) => {
      const cell = row.getCell(key);

      // Default clean border for all data cells
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFF1F5F9' } },
        bottom: { style: 'thin', color: { argb: 'FFF1F5F9' } },
        left: { style: 'thin', color: { argb: 'FFF1F5F9' } },
        right: { style: 'thin', color: { argb: 'FFF1F5F9' } },
      };

      // Styling for IP Hit Count / Total Hits with conditional color badges:
      // - < 5 hits: Green
      // - 5 to 12 hits: Yellow
      // - > 12 hits: Red
      if (hitCountColKeys.has(key)) {
        const rawVal = cell.value;
        const count =
          typeof rawVal === 'number'
            ? rawVal
            : Number(String(rawVal ?? '').replace(/[^0-9.-]/g, ''));

        if (!isNaN(count) && rawVal !== null && rawVal !== undefined && rawVal !== '') {
          let bgArgb = 'FFD1FAE5';   // Pastel Green (< 5 hits)
          let fontArgb = 'FF065F46'; // Dark Emerald Green Text
          let borderArgb = 'FFA7F3D0';

          if (count > 12) {
            bgArgb = 'FFFEE2E2';   // Pastel Red (> 12 hits)
            fontArgb = 'FF991B1B'; // Dark Crimson Red Text
            borderArgb = 'FFFCA5A5';
          } else if (count >= 5) {
            bgArgb = 'FFFEF3C7';   // Pastel Yellow/Amber (5 to 12 hits)
            fontArgb = 'FF92400E'; // Dark Amber/Brown Text
            borderArgb = 'FFFDE68A';
          }

          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: bgArgb },
          };
          cell.font = {
            name: 'Calibri',
            bold: true,
            color: { argb: fontArgb },
            size: 11,
          };
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };
          cell.border = {
            top: { style: 'thin', color: { argb: borderArgb } },
            bottom: { style: 'thin', color: { argb: borderArgb } },
            left: { style: 'thin', color: { argb: borderArgb } },
            right: { style: 'thin', color: { argb: borderArgb } },
          };
        } else {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
      } else if (ipAddressColKeys.has(key)) {
        // Prominent monospace styling for IP Addresses
        cell.font = {
          name: 'Consolas',
          size: 10.5,
          color: { argb: 'FF0F172A' },
          bold: true,
        };
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
        };
      }
    });
  });

  // Calculate responsive column widths
  worksheet.columns.forEach((column) => {
    const key = column.key as string;
    let maxLength = column.header ? column.header.toString().length : 12;
    const sampleLimit = Math.min(worksheet.rowCount, 100);
    for (let r = 2; r <= sampleLimit; r++) {
      const cell = worksheet.getRow(r).getCell(key);
      const cellLen = cell.value ? cell.value.toString().length : 0;
      if (cellLen > maxLength) maxLength = cellLen;
    }

    if (hitCountColKeys.has(key)) {
      column.width = Math.max(maxLength + 4, 15);
    } else if (ipAddressColKeys.has(key)) {
      column.width = Math.max(maxLength + 4, 18);
    } else {
      column.width = Math.min(maxLength < 14 ? 14 : maxLength + 3, 60);
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `${filename}.xlsx`);
};
