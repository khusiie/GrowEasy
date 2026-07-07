import React from 'react';

interface StatusLegendProps {
  data?: any[];
}

export default function StatusLegend({ data = [] }: StatusLegendProps) {
  const statuses = [
    {
      id: 'GOOD_LEAD_FOLLOW_UP',
      desc: 'High potential lead requiring immediate engagement.',
      colorClass: 'text-white bg-accent border-white/10',
    },
    {
      id: 'SALE_DONE',
      desc: 'Successfully converted lead. Mission accomplished!',
      colorClass: 'text-success bg-success/10 border-success/30',
    },
    {
      id: 'DID_NOT_CONNECT',
      desc: 'Attempted contact but unreachable. Needs retry.',
      colorClass: 'text-warning bg-warning/10 border-warning/30',
    },
    {
      id: 'BAD_LEAD',
      desc: 'Invalid, unqualified, or uninterested contact.',
      colorClass: 'text-error bg-error/10 border-error/30',
    },
    {
      id: 'UNKNOWN',
      desc: 'Status could not be determined by AI.',
      colorClass: 'text-text-secondary bg-white/5 border-white/10',
    }
  ];

  const getCount = (statusId: string) => {
    return data.filter(item => item.crm_status === statusId).length;
  };

  return (
    <div className="glass-panel p-6 mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
      <h3 className="text-lg font-bold text-text-primary mb-4">
        CRM Status Summary
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statuses.map((s) => {
          const count = getCount(s.id);
          return (
            <div key={s.id} className="flex flex-col gap-2 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <span className={`inline-flex w-max px-3 py-1.5 rounded-full text-xs font-bold border ${s.colorClass}`}>
                  {s.id}
                </span>
                {data.length > 0 && (
                  <span className={`text-2xl font-black ${s.colorClass.split(' ')[0]}`}>
                    {count}
                  </span>
                )}
              </div>
              <span className="text-sm text-text-secondary">{s.desc}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
