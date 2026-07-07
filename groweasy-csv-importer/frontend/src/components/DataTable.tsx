import React from 'react';

interface DataTableProps {
  data: any[];
  columns: string[];
}

export default function DataTable({ data, columns }: DataTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-panel p-16 text-center text-text-secondary text-lg my-8">
        <p>No data to display.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel w-full max-h-[60vh] overflow-auto my-8 relative">
      <table className="w-full border-collapse text-left whitespace-nowrap">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th 
                key={index} 
                className="sticky top-0 bg-bg-alt/95 backdrop-blur-md text-text-primary py-4 px-6 font-semibold text-sm uppercase tracking-wide border-b border-glass-border z-10"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className="transition-colors duration-200 border-b border-white/5 hover:bg-white/5"
            >
              {columns.map((col, colIndex) => {
                const val = row[col];
                let displayVal = val;
                if (typeof val === 'object' && val !== null) {
                  displayVal = JSON.stringify(val);
                }
                
                let tdClass = "py-4 px-6 text-text-secondary text-sm max-w-[300px] overflow-hidden text-ellipsis";
                
                // Badges
                if (col === 'crm_status' && val) {
                  tdClass += " font-bold rounded-full px-3 py-1 text-xs inline-flex border mt-1";
                  if (val === 'GOOD_LEAD_FOLLOW_UP') tdClass += " text-white bg-accent border-white/10";
                  if (val === 'DID_NOT_CONNECT') tdClass += " text-warning bg-warning/10 border-warning/30";
                  if (val === 'BAD_LEAD') tdClass += " text-error bg-error/10 border-error/30";
                  if (val === 'SALE_DONE') tdClass += " text-success bg-success/10 border-success/30";
                  if (val === 'UNKNOWN') tdClass += " text-text-secondary bg-white/5 border-white/10";
                }
                
                if (col === 'status') {
                   tdClass += " font-semibold rounded px-2 py-1 text-xs inline-block ml-4 mt-3";
                   tdClass += val === 'success' ? " text-success" : " text-error";
                }

                return (
                  <td key={colIndex} className={tdClass}>
                    {displayVal}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
