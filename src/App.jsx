import React, { useEffect, useState } from 'react'
import Chatbot from './Chatbot'
import Streamgraph from './components/Streamgraph'
import BarometreRadial from './components/BarometreRadial'
import ThemeDoubleChart from './components/ThemeDoubleChart'
import CreativeThreeCanvas from './components/CreativeThreeCanvas'
import WorldMap from './components/WorldMap'

export default function App() {
  const [baroData, setBaroData] = useState(null)
  const [activeTab, setActiveTab] = useState('graphique')
  const [filmHighlightedCountries, setFilmHighlightedCountries] = useState([])
  const [filmSelectedCountry, setFilmSelectedCountry] = useState('all')
  const [isChartDropdownOpen, setIsChartDropdownOpen] = useState(false)
  const [selectedChartIndex, setSelectedChartIndex] = useState(0)

  const charts = [
    { value: 0, label: "Parité temps de parole", icon: "📊", desc: "Chord Diagram" },
    { value: 1, label: "Hiérarchie des médias", icon: "🔍", desc: "Sunburst Chart" },
    { value: 2, label: "Films les plus diffusés", icon: "🎬", desc: "Radial Bar Chart" },
    { value: 3, label: "Répartition par genre", icon: "🥞", desc: "Radial Stacked" },
    { value: 4, label: "Évolution thématique", icon: "📈", desc: "Streamgraph" },
    { value: 5, label: "Spécialisation par chaîne", icon: "🎡", desc: "Radial Bar" },
    { value: 6, label: "Thématiques (double barres)", icon: "📊", desc: "Side-by-side theme chart" }
  ]

  const handleChartSelect = (index) => {
    setSelectedChartIndex(index)
    setIsChartDropdownOpen(false)
    const selectEl = document.getElementById('chart-select')
    if (selectEl) {
      selectEl.value = index
      const event = new Event('change', { bubbles: true })
      selectEl.dispatchEvent(event)
    }
  }

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

  useEffect(() => {
    const handleNextPrev = () => {
      const selectEl = document.getElementById('chart-select')
      if (selectEl) {
        setSelectedChartIndex(parseInt(selectEl.value))
      }
    }

    const prevBtn = document.getElementById('btn-prev')
    const nextBtn = document.getElementById('btn-next')
    if (prevBtn) prevBtn.addEventListener('click', handleNextPrev)
    if (nextBtn) nextBtn.addEventListener('click', handleNextPrev)

    const handleClickOutside = () => setIsChartDropdownOpen(false)
    document.addEventListener('click', handleClickOutside)

    return () => {
      if (prevBtn) prevBtn.removeEventListener('click', handleNextPrev)
      if (nextBtn) nextBtn.removeEventListener('click', handleNextPrev)
      document.removeEventListener('click', handleClickOutside)
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
            <div style={{ width: '750px', maxWidth: '90vw' }}>
                <img src="/svg/mmi_speak.svg" alt="MMI SPEAK" style={{ width: '100%', height: 'auto' }} />
            </div>
        </div>
        <div className="intro-content" id="intro-step-2">
            <div className="intro-sae" style={{ opacity: 0.9, fontSize: '2.5rem', letterSpacing: '0.4em' }}>présente</div>
        </div>
        <div className="intro-content" id="intro-step-3">
            <div className="intro-sae">SAE 302</div>
            <h1 className="intro-title" style={{ fontSize: '3rem', marginBottom: '15px' }}>DATAVISUALISATION</h1>
            <h2 className="intro-title-main" style={{ fontSize: '2.2rem' }}>Les Français face à l'information</h2>
            <div className="intro-authors">
                <span className="author-label">Auteurs</span>
                <span className="author-name">Samuel Ralaikoa</span>
                <span className="author-name">Kinaya Zakaria</span>
                <span className="author-name">Dienaba Sow</span>
            </div>
        </div>
    </div>

    <nav className="main-navbar">
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="nav-dropdown-wrapper" onClick={(e) => e.stopPropagation()}>
            <button 
              className={`nav-btn ${activeTab === 'graphique' ? 'active' : ''}`} 
              onClick={() => {
                setActiveTab('graphique');
                setIsChartDropdownOpen(!isChartDropdownOpen);
              }} 
              id="nav-mode-graphique"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span>Graphique</span>
              <i className={isChartDropdownOpen ? "fas fa-chevron-up" : "fas fa-chevron-down"} style={{ fontSize: '0.8rem' }}></i>
            </button>
            <div className={`nav-dropdown-menu ${isChartDropdownOpen ? 'active' : ''}`} style={{ top: 'calc(100% + 5px)', width: '250px' }}>
              {charts.map((c, i) => (
                <div 
                  key={c.value} 
                  className={`nav-dropdown-item ${activeTab === 'graphique' && selectedChartIndex === i ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('graphique');
                    handleChartSelect(i);
                  }}
                  style={{ padding: '12px 20px' }}
                >
                  <div className="nav-dropdown-item-title" style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                    <span>{c.label}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Hidden select element so D3 app.js can still bind and sync normally */}
            <select id="chart-select" style={{ display: 'none' }} defaultValue="0">
              {charts.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
            <button className={`nav-btn ${activeTab === 'crea' ? 'active' : ''}`} onClick={() => { setActiveTab('crea'); document.body.classList.add('artistic-mode-active'); }} id="nav-mode-crea">
                Créatif
            </button>
            <button className={`nav-btn ${activeTab === 'visuel' ? 'active' : ''}`} onClick={() => { setActiveTab('visuel'); document.body.classList.add('visuel-mode-active'); }} id="nav-mode-visuel">
                Visuel
            </button>
        </div>

    </nav>


    <div id="analytic-view" style={{ display: activeTab === 'graphique' ? 'block' : 'none' }}>
        <div className={`main-layout ${selectedChartIndex === 2 ? 'films-mode' : ''}`}>

            {/* LEFT PANEL: regular controls OR world map in films mode */}
            {selectedChartIndex === 2 ? (
              <div className="left-panel films-map-panel">
                <WorldMap
                  highlightedCountries={filmHighlightedCountries}
                  selectedCountry={filmSelectedCountry}
                  onCountryClick={(countryCode) => {
                    const newVal = filmSelectedCountry === countryCode ? 'all' : countryCode
                    setFilmSelectedCountry(newVal)
                    const sel = document.getElementById('country-select')
                    if (sel) {
                      sel.value = newVal
                      sel.dispatchEvent(new Event('change', { bubbles: true }))
                    }
                    const selRight = document.getElementById('country-select-right')
                    if (selRight) selRight.value = newVal
                  }}
                />
              </div>
            ) : (
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

                {/* film-controls hidden here - shown via right panel when on films slide */}
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
                        <input type="range" id="year-min" min="1946" max="1999" defaultValue="1946" step="1" />
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


            </div>
            )}


            <div className="center-panel">
                <div className="chart-main-title" id="main-chart-title" data-interactive="true">PARITÉ TEMPS DE PAROLE</div>
                
                <div className="chart-wrapper">
                    <div id="analysis-overlay" className="analysis-overlay">
                        <div id="analysis-header" className="analysis-header">BILAN</div>
                        <div id="analysis-body" className="analysis-body">...</div>
                    </div>

                    <div id="slide-0" className={`slide ${selectedChartIndex === 0 ? 'active' : ''}`} style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                    <div className="slide0-vertical-layout">

                        {/* CHARTE 1 — Hommes */}
                        <div className="slide0-chart-section">
                            <div className="slide0-chart-label slide0-label-men">
                                <span className="slide0-label-num">01</span>
                                <span className="slide0-label-title">Part des hommes</span>
                            </div>
                            <div id="chart-men-only" className="slide0-chart-container"></div>
                        </div>

                        {/* TEXTE ENTRE 1 et 2 */}
                        <div className="slide0-intertext">
                            <div className="slide0-intertext-arrow">↓</div>
                            <div className="slide0-intertext-box">
                                <p>
                                    <strong>Les hommes</strong> monopolisent une part écrasante du temps de parole médiatique — en moyenne <strong style={{color:'var(--col-men)'}}>plus de 60 %</strong> sur l'ensemble des chaînes analysées. Cette domination s'observe de façon constante, quelle que soit la thématique ou le format d'émission.
                                </p>
                            </div>
                        </div>

                        {/* CHARTE 2 — Femmes */}
                        <div className="slide0-chart-section">
                            <div className="slide0-chart-label slide0-label-women">
                                <span className="slide0-label-num">02</span>
                                <span className="slide0-label-title">Part des femmes</span>
                            </div>
                            <div id="chart-women-only" className="slide0-chart-container"></div>
                        </div>

                        {/* TEXTE ENTRE 2 et 3 */}
                        <div className="slide0-intertext">
                            <div className="slide0-intertext-arrow">↓</div>
                            <div className="slide0-intertext-box">
                                <p>
                                    <strong>Les femmes</strong> restent largement sous-représentées, leur temps de parole peinant à dépasser le seuil symbolique de <strong style={{color:'var(--col-women)'}}>40 %</strong>. Seules quelques chaînes — notamment publiques — se rapprochent d'une parité effective, révélant une inégalité structurelle ancrée dans le paysage audiovisuel.
                                </p>
                            </div>
                        </div>

                        {/* CHARTE 3 — Les deux */}
                        <div className="slide0-chart-section">
                            <div className="slide0-chart-label slide0-label-both">
                                <span className="slide0-label-num">03</span>
                                <span className="slide0-label-title">Bilan global H / F</span>
                            </div>
                            <div id="chart-both" className="slide0-chart-container"></div>
                        </div>

                        {/* TEXTE FINAL */}
                        <div className="slide0-intertext slide0-conclusion">
                            <div className="slide0-intertext-box slide0-conclusion-box">
                                <p>
                                    <strong>Le bilan global</strong> illustre concrètement le déséquilibre persistant de la représentation médiatique. L'écart entre les deux courbes révèle une asymétrie historique qui, malgré de légères progressions, demeure profondément ancrée dans les pratiques éditoriales françaises.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
                    <div id="slide-1" className="slide">
                        <div id="sunburst-breadcrumbs"></div>
                        <div id="chart-sunburst" style={{width: '100%', height: '100%'}}></div>
                    </div>
                    <div id="slide-2" className="slide">
                        <div className="center-info-radial" id="radial-info">
                            <span className="center-rank">INFO</span>
                            <div className="center-title">Survolez un film</div>
                            <div className="center-detail">Visualisation Interactive</div>
                            <div className="center-count">--</div>
                        </div>
                        <div id="chart-films" style={{width: '100%', height: '100%'}}></div>
                    </div>
                    <div id="slide-3" className="slide">
                        <div id="chart-radial-stacked" style={{width: '100%', height: '100%'}}></div>
                    </div>
                    <div id="slide-4" className="slide">
                        {baroData ? <Streamgraph data={baroData} /> : <p>Chargement...</p>}
                    </div>
                    <div id="slide-5" className="slide">
                        {baroData ? <BarometreRadial data={baroData} /> : <p>Chargement...</p>}
                    </div>
                    <div id="slide-6" className="slide">
                        <ThemeDoubleChart />
                    </div>
                </div>
            </div>

            <div className={`right-panel ${selectedChartIndex === 2 ? 'films-mode-right' : ''}`} id="right-panel-main">
                <h2 className="section-title" id="info-header" data-interactive="true"
                    style={{ display: selectedChartIndex === 2 ? 'none' : '' }}>DÉTAILS</h2>
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

                {/* Films filters shown in right panel only for slide 2 */}
                <div id="film-controls-right" style={{ display: selectedChartIndex === 2 ? 'block' : 'none', width: '100%' }}>
                    <div className="section-title" style={{ marginTop: '20px' }}>Filtres Films</div>
                    <div style={{ marginBottom: '14px' }}>
                        <label>Pays de Production</label>
                        <select id="country-select-right"
                            style={{ width: '100%', padding: '10px', background: 'rgba(128,128,128,0.08)', color: 'var(--text-main)', border: 'none', borderRadius: '6px', fontSize: '0.9rem' }}
                            onChange={e => {
                                const original = document.getElementById('country-select')
                                if (original) { original.value = e.target.value; original.dispatchEvent(new Event('change', { bubbles: true })) }
                            }}
                        >
                            <option value="all">Tous les pays</option>
                            <option value="FR">France</option>
                            <option value="US">États-Unis</option>
                            <option value="IT">Italie</option>
                            <option value="coprod">Co-productions</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '14px' }}>
                        <label>Année de Sortie (min)</label>
                        <input type="range" id="year-min-right" min="1946" max="1999" defaultValue="1946" step="1"
                            style={{ width: '100%' }}
                            onInput={e => {
                                const original = document.getElementById('year-min')
                                if (original) { original.value = e.target.value; original.dispatchEvent(new Event('input', { bubbles: true })) }
                                document.getElementById('year-val-right').textContent = e.target.value
                            }}
                        />
                        <div style={{ textAlign: 'center', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                            Films après <span id="year-val-right">1946</span>
                        </div>
                    </div>
                    <div style={{ marginBottom: '14px' }}>
                        <label>Dernière Diffusion</label>
                        <select id="diff-select-right"
                            style={{ width: '100%', padding: '10px', background: 'rgba(128,128,128,0.08)', color: 'var(--text-main)', border: 'none', borderRadius: '6px', fontSize: '0.9rem' }}
                            onChange={e => {
                                const original = document.getElementById('diff-select')
                                if (original) { original.value = e.target.value; original.dispatchEvent(new Event('change', { bubbles: true })) }
                            }}
                        >
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
        <button 
            className="nav-btn-corner" 
            id="btn-prev" 
            title="Précédent"
            style={{
                position: 'fixed',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 21000,
                display: activeTab === 'graphique' ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <i className="fas fa-chevron-left"></i>
        </button>
        <button 
            className="nav-btn-corner" 
            id="btn-next" 
            title="Suivant"
            style={{
                position: 'fixed',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 21000,
                display: activeTab === 'graphique' ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <i className="fas fa-chevron-right"></i>
        </button>
    </div>

    <div id="artistic-view" style={{ display: activeTab === 'crea' ? 'flex' : 'none', flexDirection: 'column', position: 'relative', width: '100%', height: '100%' }}>
        <a id="btn-download-pdf" href="Rendu final datavisualisation.pdf" download="Infographie_DataVis.pdf" style={{ zIndex: 10 }}>
            <i className="fas fa-file-pdf"></i> VOIR L'INFOGRAPHIE
        </a>
        <div style={{ flex: 1, width: '100%', height: '100%' }}>
            <CreativeThreeCanvas />
        </div>
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


    <Chatbot />
    </>
  )
}
