import React, { useEffect, useState } from 'react';

export default function ThemeDoubleChart() {
    const [data, setData] = useState([]);
    const [average, setAverage] = useState(0);

    useEffect(() => {
        const d3 = window.d3;
        if (!d3) return;

        d3.csv("/csv/ina-csa-parole-femmes-genreprogramme.csv")
            .then(rawData => {
                let totalWomen = 0;
                let totalMen = 0;
                
                const processed = rawData
                    .filter(d => d.genre && d.genre.trim() !== "" && d.genre !== "Non Renseigné")
                    .map(d => {
                        const women = parseFloat(d.women_speech_duration_2020) || 0;
                        const men = parseFloat(d.men_speech_duration_2020) || 0;
                        const total = women + men;
                        const pctF = total > 0 ? (women / total) * 100 : 0;
                        const pctM = total > 0 ? (men / total) * 100 : 0;
                        
                        totalWomen += women;
                        totalMen += men;

                        return {
                            genre: d.genre,
                            women,
                            men,
                            total,
                            pctF,
                            pctM
                        };
                    })
                    // Sort ascending by pctF so the lowest is at the top, highest at the bottom
                    .sort((a, b) => a.pctF - b.pctF);

                const overallAvg = (totalWomen / (totalWomen + totalMen)) * 100;
                setAverage(overallAvg);
                setData(processed);
            })
            .catch(console.error);
    }, []);

    if (data.length === 0) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-main)' }}>
                Chargement des données thématiques...
            </div>
        );
    }

    const rowHeight = 32;
    const padding = { top: 40, right: 60, bottom: 40, left: 160 };
    const chartHeight = data.length * rowHeight + padding.top + padding.bottom;
    const chartWidth = 500;
    
    // Scale for Left Chart (0% to 50% to make the differences visible)
    const xLeftMax = 50;
    const xLeftScale = (val) => {
        const availableWidth = chartWidth - padding.left - padding.right;
        return padding.left + (val / xLeftMax) * availableWidth;
    };

    // Scale for Right Chart (0% to 100%)
    const paddingRightChart = { top: 40, right: 20, bottom: 40, left: 20 };
    const xRightScale = (val) => {
        const availableWidth = chartWidth - paddingRightChart.left - paddingRightChart.right;
        return paddingRightChart.left + (val / 100) * availableWidth;
    };

    const yLeftScale = (index) => {
        return padding.top + index * rowHeight;
    };

    return (
        <div className="double-chart-container" style={{
            display: 'flex',
            gap: '24px',
            width: '100%',
            height: '100%',
            overflowY: 'auto',
            padding: '10px 20px',
            boxSizing: 'border-box',
            justifyContent: 'center',
            alignItems: 'flex-start'
        }}>
            {/* Left Card: Part de parole féminine par thème */}
            <div className="chart-card-glass" style={{
                flex: '1',
                maxWidth: '550px',
                background: 'var(--bg-card)',
                border: '1px solid var(--accent-ui)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(8px)'
            }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: '700' }}>
                    Part de parole féminine par thème
                </h3>
                <p style={{ margin: '0 0 20px 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Ligne pointillée = moyenne ({average.toFixed(1)}%). Bleu = sous la moyenne ({average.toFixed(1)}%). Rouge = supérieur ou égal.
                </p>
                <div style={{ width: '100%', overflow: 'hidden' }}>
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height="100%">
                        {/* Grid lines */}
                        {[10, 20, 30, 40, 50].map(val => {
                            const xPos = xLeftScale(val);
                            return (
                                <g key={val}>
                                    <line 
                                        x1={xPos} 
                                        y1={padding.top - 10} 
                                        x2={xPos} 
                                        y2={chartHeight - padding.bottom} 
                                        stroke="var(--text-muted)" 
                                        strokeOpacity="0.1" 
                                        strokeDasharray="2 2"
                                    />
                                    <text 
                                        x={xPos} 
                                        y={chartHeight - padding.bottom + 18} 
                                        textAnchor="middle" 
                                        fill="var(--text-muted)" 
                                        fontSize="10px"
                                        fontWeight="500"
                                    >
                                        {val}%
                                    </text>
                                </g>
                            );
                        })}

                        {/* Average Dotted Line */}
                        <line 
                            x1={xLeftScale(average)} 
                            y1={padding.top - 10} 
                            x2={xLeftScale(average)} 
                            y2={chartHeight - padding.bottom} 
                            stroke="var(--text-muted)" 
                            strokeWidth="1.5" 
                            strokeDasharray="4 4"
                            opacity="0.6"
                        />
                        <text 
                            x={xLeftScale(average)} 
                            y={padding.top - 18} 
                            textAnchor="middle" 
                            fill="var(--text-muted)" 
                            fontSize="10px"
                            fontWeight="600"
                            letterSpacing="0.05em"
                        >
                            moy. {average.toFixed(1)}%
                        </text>

                        {/* Data Rows */}
                        {data.map((d, i) => {
                            const yPos = yLeftScale(i);
                            const barWidth = xLeftScale(d.pctF) - padding.left;
                            const isAboveAverage = d.pctF >= average;
                            const barColor = isAboveAverage ? 'var(--col-women, #F44336)' : 'var(--col-men, #2196F3)';

                            return (
                                <g key={d.genre} className="chart-row-group" style={{ cursor: 'pointer' }}>
                                    {/* Y label */}
                                    <text 
                                        x={padding.left - 15} 
                                        y={yPos + 14} 
                                        textAnchor="end" 
                                        fill="var(--text-main)" 
                                        fontSize="11px" 
                                        fontWeight="600"
                                    >
                                        {d.genre}
                                    </text>
                                    
                                    {/* Bar background path for hover effect */}
                                    <rect 
                                        x={padding.left} 
                                        y={yPos - 2} 
                                        width={chartWidth - padding.left - padding.right + 20} 
                                        height={24} 
                                        fill="transparent"
                                        rx="4"
                                        className="row-hover-bg"
                                    />

                                    {/* Left chart bar */}
                                    <rect 
                                        x={padding.left} 
                                        y={yPos} 
                                        width={Math.max(0, barWidth)} 
                                        height={18} 
                                        fill={barColor} 
                                        rx="4"
                                        style={{ transition: 'all 0.3s ease' }}
                                    />
                                    
                                    {/* Value label */}
                                    <text 
                                        x={xLeftScale(d.pctF) + 8} 
                                        y={yPos + 13} 
                                        fill="var(--text-main)" 
                                        fontSize="10.5px" 
                                        fontWeight="700"
                                    >
                                        {d.pctF.toFixed(1)}%
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </div>

            {/* Right Card: Répartition Femmes / Hommes (100 %) */}
            <div className="chart-card-glass" style={{
                flex: '1',
                maxWidth: '550px',
                background: 'var(--bg-card)',
                border: '1px solid var(--accent-ui)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(8px)'
            }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: '700' }}>
                    Répartition Femmes / Hommes (100 %)
                </h3>
                <p style={{ margin: '0 0 20px 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Chaque ligne = 100% de la parole. Rouge = femmes, bleu = hommes.
                </p>
                <div style={{ width: '100%', overflow: 'hidden' }}>
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height="100%">
                        {/* Grid lines */}
                        {[0, 20, 40, 60, 80, 100].map(val => {
                            const xPos = xRightScale(val);
                            return (
                                <g key={val}>
                                    <line 
                                        x1={xPos} 
                                        y1={padding.top - 10} 
                                        x2={xPos} 
                                        y2={chartHeight - padding.bottom} 
                                        stroke="var(--text-muted)" 
                                        strokeOpacity="0.1" 
                                        strokeDasharray="2 2"
                                    />
                                    <text 
                                        x={xPos} 
                                        y={chartHeight - padding.bottom + 18} 
                                        textAnchor="middle" 
                                        fill="var(--text-muted)" 
                                        fontSize="10px"
                                        fontWeight="500"
                                    >
                                        {val}%
                                    </text>
                                </g>
                            );
                        })}

                        {/* Stacked Bars */}
                        {data.map((d, i) => {
                            const yPos = yLeftScale(i);
                            const wWomen = xRightScale(d.pctF) - paddingRightChart.left;
                            const wMen = xRightScale(100) - xRightScale(d.pctF);

                            return (
                                <g key={d.genre + '-stacked'}>
                                    {/* Women part */}
                                    <rect 
                                        x={paddingRightChart.left} 
                                        y={yPos} 
                                        width={Math.max(0, wWomen)} 
                                        height={18} 
                                        fill="var(--col-women, #F44336)" 
                                        rx="4"
                                    />
                                    {/* Men part */}
                                    <rect 
                                        x={xRightScale(d.pctF)} 
                                        y={yPos} 
                                        width={Math.max(0, wMen)} 
                                        height={18} 
                                        fill="var(--col-men, #2196F3)" 
                                        rx="4"
                                    />
                                </g>
                            );
                        })}
                    </svg>
                </div>
                {/* Legend at bottom */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    marginTop: '10px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: 'var(--text-main)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--col-women, #F44336)' }}></span>
                        Femmes
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--col-men, #2196F3)' }}></span>
                        Hommes
                    </div>
                </div>
            </div>
        </div>
    );
}
