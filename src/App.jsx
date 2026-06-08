import React, { useEffect, useState } from 'react'
import Chatbot from './Chatbot'
import WorldMap from './components/WorldMap'
import ThemeDoubleChart from './components/ThemeDoubleChart'

export default function App() {
  const [activeMode, setActiveMode] = useState('graphique')
  const [selectedCountry, setSelectedCountry] = useState('all')

  useEffect(() => {
    const script = document.createElement('script')
    script.src = '/app.js'
    script.async = true
    document.body.appendChild(script)

    showGraphique()

    return () => {
      document.body.removeChild(script)
      document.body.classList.remove('artistic-mode-active')
    }
  }, [])

  const hideAllViews = () => {
    const articleView = document.getElementById('article-view')
    const analyticView = document.getElementById('analytic-view')
    const artisticView = document.getElementById('artistic-view')

    if (articleView) articleView.style.display = 'none'
    if (analyticView) analyticView.style.display = 'none'
    if (artisticView) artisticView.style.display = 'none'
    document.body.classList.remove('artistic-mode-active')
  }

  const showGraphique = () => {
    hideAllViews()
    const analyticView = document.getElementById('analytic-view')
    if (analyticView) analyticView.style.display = 'block'
    document.body.classList.remove('artistic-mode-active')
    setActiveMode('graphique')
  }

  const showCrea = () => {
    hideAllViews()
    const artisticView = document.getElementById('artistic-view')
    if (artisticView) artisticView.style.display = 'flex'
    document.body.classList.add('artistic-mode-active')
    setActiveMode('crea')
  }

  return (
    <div>
      <div id="transition-overlay">
        <div className="transition-text" id="transition-title">CHARGEMENT</div>
        <div className="transition-sub" id="transition-body">Analyse des données en cours...</div>
      </div>

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

      <nav className="main-navbar" style={{ display: activeMode === 'crea' ? 'none' : 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="nav-links" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            className={`nav-btn ${activeMode === 'graphique' ? 'active' : ''}`}
            id="nav-mode-graphique"
            onClick={showGraphique}
          >
            Graphique
          </button>
          <button
            className={`nav-btn ${activeMode === 'crea' ? 'active' : ''}`}
            id="nav-mode-crea"
            onClick={showCrea}
          >
            Créatif
          </button>
        </div>
        <div className="nav-dropdown" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label htmlFor="chart-select" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Choisir la vue
          </label>
          <select id="chart-select" style={{ minWidth: '220px', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.08)', color: 'inherit' }} defaultValue="0">
            <option value="0">Parité temps de parole</option>
            <option value="1">Hiérarchie des médias</option>
            <option value="2">Films les plus diffusés</option>
            <option value="3">Répartition par genre</option>
            <option value="4">Évolution thématique</option>
            <option value="5">Spécialisation par chaîne</option>
            <option value="6">Thématiques (double barres)</option>
          </select>
        </div>
      </nav>

      <div id="article-view" style={{ display: 'none' }}></div>

      <div id="analytic-view" style={{ display: 'block' }}>
        <div className="main-layout">
          <div className="left-panel">
            <div id="generic-controls">
              <div className="section-title" data-interactive="true">Navigation</div>
              <div id="filter-list"></div>
              <div id="sunburst-controls" style={{ display: 'none', marginTop: '20px' }}>
                <div className="section-title" data-interactive="true">Sexe</div>
                <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
                  <button className="retro-btn active" id="btn-all">Tous</button>
                  <button className="retro-btn" id="btn-h">H</button>
                  <button className="retro-btn" id="btn-f">F</button>
                </div>
                <div className="section-title" data-interactive="true">Groupe Média</div>
                <div id="sunburst-groups" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}></div>
              </div>
            </div>

            <div id="meta-controls" style={{ display: 'none' }}>
              <div className="section-title" data-interactive="true">Filtres Données</div>
              <div>
                <label>Groupe / Catégorie</label>
                <select id="meta-group-select"><option value="all">Tous</option></select>
              </div>
              <div style={{ marginTop: '15px' }}>
                <label>Média / Nom</label>
                <select id="meta-media-select"><option value="all">Tous</option></select>
              </div>
              <div style={{ marginTop: '20px' }}>
                <button className="retro-btn" id="btn-meta-reset">Réinitialiser Vue</button>
              </div>
            </div>

            <div id="film-controls" style={{ display: 'none' }}>
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
              <div style={{ marginTop: '15px' }}>
                <label>Année de Sortie (min)</label>
                <input type="range" id="year-min" min="1946" max="1999" defaultValue="1946" step="1" />
                <div style={{ textAlign: 'center', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                  Films après <span id="year-val">1946</span>
                </div>
              </div>
              <div style={{ marginTop: '15px' }}>
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

            <div id="reset-container" style={{ display: 'none', marginTop: '20px' }}>
              <button className="retro-btn" id="btn-reset">Réinitialiser</button>
            </div>
          </div>

          <div className="center-panel">
            <div className="chart-main-title" id="main-chart-title" data-interactive="true">PARITÉ TEMPS DE PAROLE</div>
            <div className="chart-wrapper">
              <div id="slide-0" className="slide" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                <div className="slide0-vertical-layout slide0-bg-white">
                  <div className="slide0-chart-section slide0-chart-section-large">
                    <div className="slide0-chart-label slide0-label-men">
                      <span className="slide0-label-num">01</span>
                      <span className="slide0-label-title">Part des hommes</span>
                    </div>
                    <div id="chart-men-only" className="slide0-chart-container"></div>
                  </div>
                  <div className="slide0-chart-section slide0-chart-section-large">
                    <div className="slide0-chart-label slide0-label-women">
                      <span className="slide0-label-num">02</span>
                      <span className="slide0-label-title">Part des femmes</span>
                    </div>
                    <div id="chart-women-only" className="slide0-chart-container"></div>
                  </div>
                  <div className="slide0-chart-section slide0-chart-section-large">
                    <div className="slide0-chart-label slide0-label-both">
                      <span className="slide0-label-num">03</span>
                      <span className="slide0-label-title">Bilan global H / F</span>
                    </div>
                    <div id="chart-both" className="slide0-chart-container"></div>
                  </div>
                  <div className="slide0-explanation">
                    <p>Ces trois graphiques sont conçus pour rendre la comparaison simple : l’un montre uniquement les hommes, l’autre uniquement les femmes, et le troisième synthétise les parts de parole entre les deux sexes.</p>
                  </div>
                </div>
              </div>
              <div id="slide-1" className="slide">
                <div id="sunburst-breadcrumbs"></div>
                <div id="chart-sunburst" style={{ width: '100%', height: '100%' }}></div>
              </div>
              <div id="slide-2" className="slide">
                <div className="center-info-radial" id="radial-info">
                  <span className="center-rank">INFO</span>
                  <div className="center-title">Survolez un film</div>
                  <div className="center-detail">Visualisation Interactive</div>
                  <div className="center-count">--</div>
                </div>
                <div className="slide2-explainer">
                  <p>Clique sur un pays sur la carte pour filtrer immédiatement les films par origine. Le diagramme radial affiche alors uniquement les films correspondant à ce pays.</p>
                </div>
                <div id="chart-films" style={{ width: '100%', height: '100%' }}></div>
              </div>
              <div id="slide-3" className="slide">
                <div id="chart-radial-stacked" style={{ width: '100%', height: '100%' }}></div>
              </div>
              <div id="slide-4" className="slide">
                <div id="chart-streamgraph">Chargement du streamgraph...</div>
              </div>
              <div id="slide-5" className="slide">
                <div id="chart-baro">Chargement du radial...</div>
              </div>
              <div id="slide-6" className="slide">
                <div id="chart-theme-double">Chargement du chart thématique...</div>
              </div>
            </div>
          </div>

          <div className="right-panel" id="right-panel-main" style={{ display: 'none' }}>
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
                  <span style={{ color: 'var(--col-men)' }}>H</span>
                  <span style={{ color: 'var(--col-women)' }}>F</span>
                </div>
                <div className="gender-bar-wrapper">
                  <div id="sc-bar-men" className="gender-bar-part men" style={{ width: '50%' }}></div>
                  <div id="sc-bar-women" className="gender-bar-part women" style={{ width: '50%' }}></div>
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
            <div id="film-controls-right" style={{ display: 'none', width: '100%' }}>
              <div className="section-title" style={{ marginTop: '20px' }}>Filtres Films</div>
              <div style={{ marginBottom: '14px' }}>
                <label>Pays de Production</label>
                <select id="country-select-right" style={{ width: '100%', padding: '10px', background: 'rgba(128,128,128,0.08)', color: 'var(--text-main)', border: 'none', borderRadius: '6px', fontSize: '0.9rem' }}>
                  <option value="all">Tous les pays</option>
                  <option value="FR">France</option>
                  <option value="US">États-Unis</option>
                  <option value="IT">Italie</option>
                  <option value="coprod">Co-productions</option>
                </select>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label>Année de Sortie (min)</label>
                <input type="range" id="year-min-right" min="1946" max="1999" defaultValue="1946" step="1" style={{ width: '100%' }} />
                <div style={{ textAlign: 'center', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                  Films après <span id="year-val-right">1946</span>
                </div>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label>Dernière Diffusion</label>
                <select id="diff-select-right" style={{ width: '100%', padding: '10px', background: 'rgba(128,128,128,0.08)', color: 'var(--text-main)', border: 'none', borderRadius: '6px', fontSize: '0.9rem' }}>
                  <option value="all">Toutes</option>
                  <option value="2013">2013</option>
                  <option value="2012">2012</option>
                  <option value="2011">2011</option>
                  <option value="2010">2010</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <button className="nav-btn-corner" id="btn-prev" title="Précédent" style={{ position: 'fixed', left: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 21000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="nav-btn-corner" id="btn-next" title="Suivant" style={{ position: 'fixed', right: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 21000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <div id="artistic-view" style={{ display: 'none', flexDirection: 'column', position: 'relative', width: '100%', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div id="artistic-content"></div>
      </div>

      <Chatbot />
    </div>
  )
}
