import React, { useEffect, useState } from 'react'
import Chatbot from './Chatbot'
import Streamgraph from './components/Streamgraph'
import BarometreRadial from './components/BarometreRadial'

export default function App() {
  const [baroData, setBaroData] = useState(null)
  const [activeTab, setActiveTab] = useState('graphique') // Set graphique as default or article

  useEffect(() => {
    fetch('/csv/barometre_aggr.json')
      .then(res => res.json())
      .then(setBaroData)
      .catch(console.error)
  }, [])

  useEffect(() => {
    const script = document.createElement('script')
    script.src = '/app.js'
    script.async = true
    document.body.appendChild(script)
    
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <>
      <div id="transition-overlay">
        <div className="transition-text" id="transition-title">CHARGEMENT</div>
        <div className="transition-sub" id="transition-body">Analyse des données en cours...</div>
    </div>

    {/* ECRAN D'ACCUEIL / INTRO SCREEN */}
    <div id="intro-screen">
        <div className="intro-content active" id="intro-step-1">
            <div className="intro-sae">SAE 302</div>
            <h1 className="intro-title">DATAVISUALISATION</h1>
        </div>
        <div className="intro-content" id="intro-step-2">
            <h1 className="intro-title-main">Les Français face à l'information</h1>
            <div className="intro-authors">
                <span className="author-name">Samuel Ralaikoa</span>
                <span className="author-name">Kinaya Zakaria</span>
                <span className="author-name">Dienaba Sow</span>
            </div>
        </div>
    </div>

    <nav className="main-navbar">
        <div className="nav-links">
            <button className={`nav-btn ${activeTab === 'article' ? 'active' : ''}`} onClick={() => setActiveTab('article')} id="nav-mode-article">
                Contexte
            </button>
            <button className={`nav-btn ${activeTab === 'graphique' ? 'active' : ''}`} onClick={() => setActiveTab('graphique')} id="nav-mode-graphique">
                Graphique
            </button>
            <button className={`nav-btn ${activeTab === 'crea' ? 'active' : ''}`} onClick={() => { setActiveTab('crea'); document.body.classList.add('artistic-mode-active'); }} id="nav-mode-crea">
                Créatif
            </button>
            <button className={`nav-btn ${activeTab === 'visuel' ? 'active' : ''}`} onClick={() => { setActiveTab('visuel'); document.body.classList.add('visuel-mode-active'); }} id="nav-mode-visuel">
                Visuel
            </button>
        </div>
        <div className="nav-actions">
            <label className="switch-label" title="Mode Sombre/Clair">
                <input type="checkbox" id="toggle-theme" />
                <span className="slider">
                    <i className="fas fa-sun switch-icon"></i>
                    <i className="fas fa-moon switch-icon"></i>
                </span>
            </label>
        </div>
    </nav>

    <div id="article-view" style={{ display: activeTab === 'article' ? 'flex' : 'none', padding: '40px', overflowY: 'auto', height: '100vh', paddingTop: '100px', boxSizing: 'border-box', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ maxWidth: '900px', lineHeight: '1.6', fontSize: '1.1rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: 'var(--accent-ui)' }}>Projet SAE 302 : Datavisualisation</h1>
            <p>Cliquez sur l'onglet <strong>Graphique</strong> pour explorer visuellement nos données sur la parité et la structure thématique des médias.</p>
        </div>
    </div>

    <div id="analytic-view" style={{ display: activeTab === 'graphique' ? 'block' : 'none' }}>
        <div className="main-layout">
            <div className="left-panel">
                <div id="generic-controls">
                    <div className="section-title" data-interactive="true">Navigation</div>
                    <div id="filter-list"></div> 
                    <div id="sunburst-controls" style={{display: 'none', marginTop: '20px'}}>
                        <div className="section-title" data-interactive="true">Sexe</div>
                        <div style={{display: 'flex', gap: '5px', marginBottom: '15px'}}>
                            <button className="retro-btn active" id="btn-all">Tous</button>
                            <button className="retro-btn" id="btn-h">H</button>
                            <button className="retro-btn" id="btn-f">F</button>
                        </div>
                        <div className="section-title" data-interactive="true">Groupe Média</div>
                        <div id="sunburst-groups" style={{display: 'flex', flexDirection: 'column', gap: '5px'}}></div>
                    </div>
                </div>
                
                <div id="meta-controls" style={{display: 'none'}}>
                    <div className="section-title" data-interactive="true">Filtres Données</div>
                    <div>
                        <label>Groupe / Catégorie</label>
                        <select id="meta-group-select"><option value="all">Tous</option></select>
                    </div>
                    <div style={{marginTop: '15px'}}>
                        <label>Média / Nom</label>
                        <select id="meta-media-select"><option value="all">Tous</option></select>
                    </div>
                    <div style={{marginTop: '20px'}}>
                         <button className="retro-btn" id="btn-meta-reset">Réinitialiser Vue</button>
                    </div>
                </div>

                <div id="film-controls" style={{display: 'none'}}>
                    <div className="section-title" data-interactive="true">Filtres Films</div>
                    <div>
                        <label>Pays de Production</label>
                        <select id="country-select">
                            <option value="all">Tous les pays</option>
                            <option value="FR">France (Uniquement)</option>
                            <option value="US">États-Unis</option>
                            <option value="IT">Italie</option>
                            <option value="coprod">Co-productions</option>
                        </select>
                    </div>
                    <div style={{marginTop: '15px'}}>
                        <label>Année de Sortie (min)</label>
                        <input type="range" id="year-min" min="1946" max="1999" value="1946" step="1" />
                        <div style={{textAlign: 'center', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)'}}>
                            Films après <span id="year-val">1946</span>
                        </div>
                    </div>
                    <div style={{marginTop: '15px'}}>
                        <label>Dernière Diffusion</label>
                        <select id="diff-select">
                            <option value="all">Toutes</option>
                            <option value="2013">2013</option>
                            <option value="2012">2012</option>
                            <option value="2011">2011</option>
                            <option value="2010">2010</option>
                        </select>
                    </div>
                </div>

                <div id="reset-container" style={{display: 'none', marginTop: '20px'}}>
                    <button className="retro-btn" id="btn-reset">Réinitialiser</button>
                </div>

                <div className="stats-container" style={{marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--accent-ui)'}}>
                    <div className="section-title stats-title-btn" id="btn-stats-info" style={{cursor: 'pointer'}} title="Cliquez pour en savoir plus">
                        STATISTIQUES <i className="fas fa-question-circle" style={{fontSize: '0.8rem', opacity: '0.5', marginLeft: '5px'}}></i>
                    </div>
                    <div className="stats-box">
                        <div className="stat-row">
                            <span className="stat-label">Moyenne</span> <span className="stat-val" id="stat-mean">--</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">Médiane</span> <span className="stat-val" id="stat-med">--</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">Écart-Type</span> <span className="stat-val" id="stat-std">--</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">Variance</span> <span className="stat-val" id="stat-var">--</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">Max</span> <span className="stat-val" id="stat-max">--</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="center-panel">
                <div className="chart-main-title" id="main-chart-title" data-interactive="true">PARITÉ TEMPS DE PAROLE</div>
                
                <div className="chart-wrapper">
                    <div id="analysis-overlay" className="analysis-overlay">
                        <div id="analysis-header" className="analysis-header">BILAN</div>
                        <div id="analysis-body" className="analysis-body">...</div>
                    </div>

                    <div id="slide-0" className="slide active">
                        <div id="chart-chord" style={{width: '100%', height: '100%'}}></div>
                    </div>
                    <div id="slide-1" className="slide">
                        <div id="sunburst-breadcrumbs"></div>
                        <div id="chart-sunburst" style={{width: '100%', height: '90%'}}></div>
                    </div>
                    <div id="slide-2" className="slide">
                        <div id="chart-bundling" style={{width: '100%', height: '100%'}}></div>
                    </div>
                    <div id="slide-3" className="slide">
                        <div className="center-info-radial" id="radial-info">
                            <span className="center-rank">INFO</span>
                            <div className="center-title">Survolez un film</div>
                            <div className="center-detail">Visualisation Interactive</div>
                            <div className="center-count">--</div>
                        </div>
                        <div id="chart-films" style={{width: '100%', height: '100%'}}></div>
                    </div>
                    <div id="slide-4" className="slide">
                        <div id="chart-radial-stacked" style={{width: '100%', height: '100%'}}></div>
                    </div>
                    <div id="slide-5" className="slide">
                        {baroData ? <Streamgraph data={baroData} /> : <p>Chargement...</p>}
                    </div>
                    <div id="slide-6" className="slide">
                        {baroData ? <BarometreRadial data={baroData} /> : <p>Chargement...</p>}
                    </div>
                </div>
            </div>

            <div className="right-panel">
                <h2 className="section-title" id="info-header" data-interactive="true">DÉTAILS</h2>
                <div className="standard-card" id="std-card">
                    <div className="sc-header">
                        <img id="sc-img" className="sc-img hidden" src="" alt="Icon" />
                        <i id="sc-icon" className="fas fa-database sc-placeholder-icon"></i>
                    </div>
                    <div className="sc-title" id="sc-title">Sélectionnez</div>
                    <div className="sc-desc" id="sc-desc">Survolez les graphiques pour voir les détails.</div>
                    <div className="gender-container" id="sc-gender-box">
                        <div className="gender-labels">
                            <span style={{color: 'var(--col-men)'}}>H</span>
                            <span style={{color: 'var(--col-women)'}}>F</span>
                        </div>
                        <div className="gender-bar-wrapper">
                            <div id="sc-bar-men" className="gender-bar-part men" style={{width: '50%'}}></div>
                            <div id="sc-bar-women" className="gender-bar-part women" style={{width: '50%'}}></div>
                        </div>
                    </div>
                </div>

                <div className="tv-set" id="tv-card">
                    <div className="tv-antenna antenna-l"><div className="antenna-ball"></div></div>
                    <div className="tv-antenna antenna-r"><div className="antenna-ball"></div></div>
                    <div className="tv-screen-frame">
                        <div className="tv-screen">
                            <img id="tv-bg-image" src="https://ui-avatars.com/api/?name=TV&background=333&color=fff" alt="Screen" />
                            <div className="tv-overlay"></div>
                            <div className="tv-content-layer">
                                <div className="tv-text-wrapper">
                                    <h3 id="tv-card-title">CANAL 1</h3>
                                    <p id="tv-card-desc">En attente de signal...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tv-controls"></div>
                </div>
            </div>
        </div>
        
        <div className="nav-btn-container">
            <button className="nav-btn-corner" id="btn-prev" title="Précédent">
                [ précédent ]
            </button>
            <button className="nav-btn-corner" id="btn-next" title="Suivant">
                [ suivant ]
            </button>
        </div>
    </div>

    <div id="artistic-view" style={{ display: activeTab === 'crea' ? 'flex' : 'none' }}>
        <a id="btn-download-pdf" href="Rendu final datavisualisation.pdf" download="Infographie_DataVis.pdf">
            <i className="fas fa-file-pdf"></i> VOIR L'INFOGRAPHIE
        </a>
        <img src="svg/Créa1.svg" className="anim-crea-full" alt="Visualisation Artistique" style={{width: '100%', height: '100%', objectFit: 'contain', opacity: '0'}} />
    </div>

    {/* NOUVEAU MODE VISUEL */}
    <div id="visuel-view" style={{ display: activeTab === 'visuel' ? 'flex' : 'none' }}>
        <div className="visuel-container">
            {/* Partie Gauche : La composition Créative */}
            <div className="visuel-left">
                <div className="svg-composition">
                    <img src="svg/Créa.svg" className="layer anim-grand-cercle" />
                    <img src="svg/Cercle gradué.svg" className="layer anim-bars" />
                    <img src="svg/lignes cercle.svg" className="layer anim-lines" />
                    <img src="svg/cercle couleur.svg" className="layer anim-arcs" />
                    <img src="svg/cercle blanc 1.svg" className="layer anim-ring1" />
                    <img src="svg/cercle blanc 2.svg" className="layer anim-ring2" />
                    <img src="svg/cercle blanc 3.svg" className="layer anim-ring3" />
                    <img src="svg/Cercle pourcentage blanc.svg" className="layer anim-percent" />
                    <img src="svg/cercle texte.svg" className="layer anim-text" />
                </div>
                <button id="btn-replay-visuel">
                    <i className="fas fa-redo"></i> Rejouer l'animation
                </button>
            </div>
            
            {/* Partie Droite : La Galerie de calques interactive */}
            <div className="visuel-right">
                <div className="gallery-title">Galerie des Calques</div>
                <div className="gallery-grid">
                    <div className="gallery-item" data-layer="anim-grand-cercle">
                        <div className="gallery-thumb-bg">
                            <img src="svg/Créa.svg" alt="Créa" />
                        </div>
                        <span>Créa</span>
                    </div>
                    <div className="gallery-item" data-layer="anim-bars">
                        <div className="gallery-thumb-bg">
                            <img src="svg/Cercle gradué.svg" alt="Graduation" />
                        </div>
                        <span>Graduation</span>
                    </div>
                    <div className="gallery-item" data-layer="anim-lines">
                        <div className="gallery-thumb-bg">
                            <img src="svg/lignes cercle.svg" alt="Lignes" />
                        </div>
                        <span>Lignes</span>
                    </div>
                    <div className="gallery-item" data-layer="anim-arcs">
                        <div className="gallery-thumb-bg">
                            <img src="svg/cercle couleur.svg" alt="Données" />
                        </div>
                        <span>Données</span>
                    </div>
                    <div className="gallery-item" data-layer="anim-ring1">
                        <div className="gallery-thumb-bg">
                            <img src="svg/cercle blanc 1.svg" alt="Cercle 1" />
                        </div>
                        <span>Cercle 1</span>
                    </div>
                    <div className="gallery-item" data-layer="anim-ring2">
                        <div className="gallery-thumb-bg">
                            <img src="svg/cercle blanc 2.svg" alt="Cercle 2" />
                        </div>
                        <span>Cercle 2</span>
                    </div>
                    <div className="gallery-item" data-layer="anim-ring3">
                        <div className="gallery-thumb-bg">
                            <img src="svg/cercle blanc 3.svg" alt="Cercle 3" />
                        </div>
                        <span>Cercle 3</span>
                    </div>
                    <div className="gallery-item" data-layer="anim-percent">
                        <div className="gallery-thumb-bg">
                            <img src="svg/Cercle pourcentage blanc.svg" alt="Pourcentage" />
                        </div>
                        <span>Pourcentage</span>
                    </div>
                    <div className="gallery-item" data-layer="anim-text">
                        <div className="gallery-thumb-bg">
                            <img src="svg/cercle texte.svg" alt="Légendes" />
                        </div>
                        <span>Légendes</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {/* MODAL STATISTIQUES */}
    <div id="stats-modal" className="stats-modal-overlay">
        <div className="stats-modal-content">
            <button className="stats-modal-close" id="stats-modal-close">&times;</button>
            <h2 className="stats-modal-title">ANALYSE DES STATISTIQUES</h2>
            <p className="stats-modal-intro" id="stats-modal-context"></p>
            <div id="stats-modal-body"></div>
        </div>
    </div>
    <Chatbot />
    </>
  )
}
