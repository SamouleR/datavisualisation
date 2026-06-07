const CUSTOM_PALETTE = [
    "#4E79A7", // bleu acier
    "#E15759", // rouge corail
    "#59A14F", // vert sauge
    "#F28E2B", // orange ambre
    "#B07AA1", // violet lavande
    "#76B7B2", // turquoise doux
    "#EDC948", // or sable
    "#FF9DA7", // rose poudré
    "#9C755F", // marron cacao
    "#BAB0AC"  // gris perle
];

const COLORS = { 
    men: "#2196F3",   
    women: "#F44336", 
    palette: CUSTOM_PALETTE 
};

const MEDIA_DOMAINS = { 
    "TF1": "tf1.fr", "France 2": "france.tv", "France 3": "france.tv", 
    "Canal+": "canalplus.com", "France 5": "france.tv", "M6": "m6.fr", 
    "Arte": "arte.tv", "C8": "c8.fr", "W9": "6play.fr", "TMC": "tf1.fr", 
    "TFX": "tf1.fr", "NRJ 12": "nrj12.fr", "LCP": "lcp.fr", "France 4": "france.tv", 
    "BFM TV": "bfmtv.com", "CNews": "cnews.fr", "CStar": "cstar.fr", "Gulli": "gulli.fr", 
    "France O": "france.tv", "L'Equipe": "lequipe.fr", "6ter": "6play.fr", 
    "RMC Story": "rmcstory.bfmtv.com", "RMC Découverte": "rmcdecouverte.bfmtv.com", 
    "Chérie 25": "cherie25.fr", "LCI": "lci.fr", "France Info": "francetvinfo.fr", 
    "Paris Première": "paris-premiere.fr", "Téva": "teva.fr", "RTL 9": "rtl9.fr", 
    "TV Breizh": "tf1.fr", "Canal+ Sport": "canalplus.com", "Canal+ Cinéma": "canalplus.com", 
    "Planète+": "canalplus.com", "Eurosport": "eurosport.fr", "Disney Channel": "disney.fr", 
    "Ushuaïa TV": "ushuaiatv.fr", "Histoire TV": "histoire.fr", 
    "Toute l'Histoire": "toutelhistoire.com", 
    "France Télévisions": "francetelevisions.fr", "Groupe TF1": "groupe-tf1.fr", 
    "Groupe M6": "groupem6.fr", "Groupe Canal+": "groupe-canal-plus.com", 
    "NextRadioTV": "alticefrance.com", "NRJ Group": "nrjgroup.fr", 
    "Lagardère Active": "lagardere.com", "Radio France": "radiofrance.com",
    "Public Sénat": "publicsenat.fr", "Euronews": "euronews.com",
    "RMC": "rmc.bfmtv.com", "Europe 1": "europe1.fr", "RTL": "rtl.fr",
    "France Inter": "franceinter.fr", "France Culture": "franceculture.fr",
    "Fip": "fip.fr", "France Musique": "francemusique.fr", "Mouv": "mouv.fr",
    "RFI": "rfi.fr", "FunRadio": "funradio.fr", "NRJ": "nrj.fr", "NOSTALGIE": "nostalgie.fr",
    "franceinfo": "francetvinfo.fr", "France 24": "france24.com",
    "CANAL PLUS": "canalplus.com", "CNEWS": "cnews.fr", "FRANCE 2": "france.tv",
    "FRANCE 3": "france.tv", "FRANCE 4": "france.tv", "FRANCE 5": "france.tv",
    "BFMTV": "bfmtv.com", "CSTAR": "cstar.fr", "GULLI": "gulli.fr",
    "France Ô": "france.tv", "Virgin Radio": "virginradio.fr", "6TER": "6play.fr"
};

const SLIDE_INSIGHTS = [
    {
        title: " Parité de la parole dans les Médias",
        text: "L'analyse des données de temps de parole révèle une disparité persistante. Sur l'ensemble des chaînes analysées, la moyenne du temps de parole féminin reste inférieure à <span class='analysis-stat-highlight'>40%</span>. Les chaînes publiques (France Télévisions) tendent à montrer une meilleure équité que certaines chaînes privées historiques."
    },
    {
        title: " Hiérarchie & Groupes",
        text: "Les groupes majeurs (TF1, M6, France TV) dominent le paysage avec une structure ramifiée. On observe une concentration forte : les chaînes de la TNT plus récentes sont souvent regroupées dans des entités rachetées par ces grands groupes historiques."
    },
    {
        title: " Analyse Relationnelle ",
        text: "Cette visualisation utilise le jeu de données importé pour montrer les connexions entre les entités. Les liens courbes regroupent les relations fortes, permettant de dégager des 'clusters' visuels et de comprendre la structure du réseau."
    },
    {
        title: " Cinéma à la Télévision",
        text: "L'étude des 50 films les plus diffusés depuis 1950 montre une hégémonie culturelle des comédies populaires françaises des années 60-80 (ex: <span class='analysis-stat-highlight'>Le Capitan</span>, <span class='analysis-stat-highlight'>La Grande Vadrouille</span>). La télévision linéaire capitalise sur ces valeurs sûres en prime-time."
    }
];

const App = {
    dataChaines: [], dataGenres: [], dataMeta: [], dataFilms: [], movieCovers: {}, mediaLogos: {},
    currentSlide: 0, activeGender: 'H', activeSunburstGroups: new Set(['Tous']), selectedIds: new Set(), activeFilters: new Set(['Tous']),

    // FONCTION SIMPLIFIEE : CHARGE ET LANCE DIRECTEMENT
    async init() {
        // Logique de l'écran d'accueil (intro screen)
        const introScreen = document.getElementById('intro-screen');
        const introStep1 = document.getElementById('intro-step-1');
        const introStep2 = document.getElementById('intro-step-2');
        
        if (introScreen) {
            setTimeout(() => {
                introStep1.classList.remove('active');
                introStep2.classList.add('active');
                
                setTimeout(() => {
                    introScreen.classList.add('fade-out');
                }, 2500);
            }, 2000);
        }

        if(!document.getElementById('viz-tooltip')) { 
            const tt = document.createElement('div'); 
            tt.id = 'viz-tooltip'; 
            tt.className = 'custom-tooltip'; 
            document.body.appendChild(tt); 
        }

        document.getElementById('btn-prev').addEventListener('click', () => this.prevSlide());
        document.getElementById('btn-next').addEventListener('click', () => this.nextSlide());
        document.getElementById('btn-all').addEventListener('click', () => this.toggleGender('ALL'));
        document.getElementById('btn-h').addEventListener('click', () => this.toggleGender('H'));
        document.getElementById('btn-f').addEventListener('click', () => this.toggleGender('F'));
        
        document.getElementById('country-select').addEventListener('change', () => this.filterFilmsData());
        document.getElementById('year-min').addEventListener('input', () => this.filterFilmsData());
        document.getElementById('diff-select').addEventListener('change', () => this.filterFilmsData());
        
        document.getElementById('btn-reset').addEventListener('click', () => Viz.resetView());
        document.querySelector('.chart-wrapper').addEventListener('click', (e) => Viz.resetSelection(e));
        
        document.getElementById('meta-group-select').addEventListener('change', () => this.filterMetaData());
        document.getElementById('meta-media-select').addEventListener('change', () => this.filterMetaData());
        document.getElementById('btn-meta-reset').addEventListener('click', () => {
            document.getElementById('meta-group-select').value = 'all';
            document.getElementById('meta-media-select').value = 'all';
            this.filterMetaData();
        });

        this.initTitleInteractions();
        this.initSwitches();

        // Interactions au survol sur la galerie du mode visuel
        const compositionEl = document.querySelector('.svg-composition');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            const targetClass = item.getAttribute('data-layer');
            
            item.addEventListener('mouseenter', () => {
                const targetLayer = compositionEl ? compositionEl.querySelector(`.${targetClass}`) : null;
                if (compositionEl && targetLayer) {
                    compositionEl.classList.add('dimmed-all');
                    targetLayer.classList.add('highlighted');
                }
            });
            
            item.addEventListener('mouseleave', () => {
                const targetLayer = compositionEl ? compositionEl.querySelector(`.${targetClass}`) : null;
                if (compositionEl && targetLayer) {
                    compositionEl.classList.remove('dimmed-all');
                    targetLayer.classList.remove('highlighted');
                }
            });
        });

        // Stats modal open/close
        const statsModal = document.getElementById('stats-modal');
        document.getElementById('btn-stats-info').addEventListener('click', () => {
            this.populateStatsModal();
            statsModal.classList.add('active');
        });
        document.getElementById('stats-modal-close').addEventListener('click', () => {
            statsModal.classList.remove('active');
        });
        statsModal.addEventListener('click', (e) => {
            if(e.target === statsModal) statsModal.classList.remove('active');
        });

        try {
            // csvFilmsRaw is a global from films.js, fallbackCovers from covers.js
            const [chaines, genres, meta, covers, logos] = await Promise.all([
                d3.csv("csv/ina-csa-parole-femmes-chaines.csv").catch(()=>[]),
                d3.csv("csv/ina-csa-parole-femmes-genreprogramme.csv").catch(()=>[]),
                d3.csv("csv/6710e8d60f12d58334949614.csv").catch(()=>[]),
                d3.json("data.json").catch(()=>({})),
                d3.json("logos.json").catch(()=>({}))
            ]);
            
            this.dataChaines = chaines.filter(d => d.Editeur); 
            this.dataGenres = genres; 
            this.dataMeta = meta; 
            this.movieCovers = Object.keys(covers).length > 0 ? covers : fallbackCovers;
            this.mediaLogos = logos;
            
            this.dataFilms = d3.csvParse(csvFilmsRaw, d => ({ 
                ...d, 
                Diffusions: +d.Diffusions, 
                Rank: +d.Rank, 
                Year: +d.Year, 
                LastDiffusion: +d.LastDiffusion 
            }));
            
            this.dataFilms.forEach(d => { 
                d.Poster = this.movieCovers[d.Title] || ("https://placehold.co/300x450/5D4037/ffffff?text=" + encodeURIComponent(d.Title.substring(0,25))); 
            });
            
            this.setSlide(0);
        } catch (e) { 
            console.error("Erreur critique lors du chargement des données.", e); 
        }
    },

    initMetaControls() {
        const data = this.dataMeta;
        if(!data || data.length === 0) return;

        const keys = Object.keys(data[0]);
        const groupKey = keys.find(k => k.toLowerCase().includes('genre') || k.toLowerCase().includes('cat') || k.toLowerCase().includes('group')) || keys[1];
        const labelKey = keys[0]; 

        if (groupKey) {
            const groups = [...new Set(data.map(d => d[groupKey]))].sort();
            const groupSel = document.getElementById('meta-group-select');
            groupSel.innerHTML = '<option value="all">Tous</option>';
            groups.forEach(g => {
                if(g) {
                    const opt = document.createElement('option');
                    opt.value = g;
                    opt.innerText = g;
                    groupSel.appendChild(opt);
                }
            });
        }

        const media = [...new Set(data.map(d => d[labelKey]))].sort();
        const mediaSel = document.getElementById('meta-media-select');
        mediaSel.innerHTML = '<option value="all">Tous</option>';
        media.forEach(m => {
            if(m) {
                const opt = document.createElement('option');
                opt.value = m;
                opt.innerText = m;
                mediaSel.appendChild(opt);
            }
        });
    },

    filterMetaData() {
        const groupVal = document.getElementById('meta-group-select').value;
        const mediaVal = document.getElementById('meta-media-select').value;
        
        const data = this.dataMeta;
        if(!data || data.length === 0) return;

        const keys = Object.keys(data[0]);
        const groupKey = keys.find(k => k.toLowerCase().includes('genre') || k.toLowerCase().includes('cat') || k.toLowerCase().includes('group')) || keys[1];
        const labelKey = keys[0];
        const targetKey = keys[1] || keys[0]; 

        let filtered = data.filter(d => {
            let matchGroup = true;
            if(groupVal !== 'all' && groupKey) {
                matchGroup = (d[groupKey] === groupVal);
            }
            
            let matchMedia = true;
            if(mediaVal !== 'all') {
                matchMedia = (d[labelKey] === mediaVal || d[targetKey] === mediaVal);
            }
            
            return matchGroup && matchMedia;
        });

        Viz.renderEdgeBundlingMeta(filtered);
    },

    initTitleInteractions() {},

    initSwitches() {
        const toggleTheme = document.getElementById('toggle-theme');
        const btnGraphique = document.getElementById('nav-mode-graphique');
        const btnCrea = document.getElementById('nav-mode-crea');
        const btnVisuel = document.getElementById('nav-mode-visuel');
        
        const analyticView = document.getElementById('analytic-view');
        const artisticView = document.getElementById('artistic-view');
        const visuelView = document.getElementById('visuel-view');

        toggleTheme.addEventListener('change', (e) => {
            if(e.target.checked) document.body.classList.add('dark-mode');
            else document.body.classList.remove('dark-mode');
        });

        const resetViews = () => {
            analyticView.style.display = 'none';
            artisticView.style.display = 'none';
            if (visuelView) visuelView.style.display = 'none';
            document.body.classList.remove('artistic-mode-active', 'visuel-mode-active');
            btnGraphique.classList.remove('active');
            if(btnCrea) btnCrea.classList.remove('active');
            if(btnVisuel) btnVisuel.classList.remove('active');
        };

        if (btnGraphique) {
            btnGraphique.addEventListener('click', () => {
                resetViews();
                analyticView.style.display = 'block';
                btnGraphique.classList.add('active');
            });
        }
        
        if (btnCrea) {
            btnCrea.addEventListener('click', () => {
                resetViews();
                artisticView.style.display = 'flex';
                document.body.classList.add('artistic-mode-active');
                btnCrea.classList.add('active');
            });
        }

        if (btnVisuel) {
            btnVisuel.addEventListener('click', () => {
                resetViews();
                if(visuelView) visuelView.style.display = 'flex';
                document.body.classList.add('visuel-mode-active');
                btnVisuel.classList.add('active');
                
                // Redéclencher l'animation en clonant et remplaçant les images
                const layers = visuelView.querySelectorAll('.layer');
                layers.forEach(img => {
                    const newImg = img.cloneNode(true);
                    img.parentNode.replaceChild(newImg, img);
                });
            });
        }

        const btnReplay = document.getElementById('btn-replay-visuel');
        if (btnReplay) {
            btnReplay.addEventListener('click', () => {
                const layers = document.querySelectorAll('#visuel-view .layer');
                layers.forEach(img => {
                    const newImg = img.cloneNode(true);
                    img.parentNode.replaceChild(newImg, img);
                });
            });
        }
    },

    nextSlide() { 
        const nextIndex = (this.currentSlide + 1) % 5;
        
        const overlay = document.getElementById('transition-overlay');
        const title = document.getElementById('transition-title');
        const body = document.getElementById('transition-body');
        
        const insight = SLIDE_INSIGHTS[nextIndex];
        
        title.innerText = insight ? insight.title : "ANALYSE";
        body.innerHTML = insight ? insight.text : "";
        
        overlay.classList.add('active');
        
        setTimeout(() => {
            this.setSlide(nextIndex);
            
            setTimeout(() => {
                overlay.classList.remove('active');
            }, 500);
        }, 1200);
    },

    prevSlide() {
        const prevIndex = (this.currentSlide + 4) % 5;
        
        const overlay = document.getElementById('transition-overlay');
        const title = document.getElementById('transition-title');
        const body = document.getElementById('transition-body');
        
        const insight = SLIDE_INSIGHTS[prevIndex];
        
        title.innerText = insight ? insight.title : "ANALYSE";
        body.innerHTML = insight ? insight.text : "";
        
        overlay.classList.add('active');
        
        setTimeout(() => {
            this.setSlide(prevIndex);
            
            setTimeout(() => {
                overlay.classList.remove('active');
            }, 500);
        }, 1200);
    },

    setSlide(index) {
        this.currentSlide = index; 
        this.selectedIds.clear(); 
        Viz.clearSelectionStyle(); 
        this.activeFilters.clear(); 
        this.activeFilters.add('Tous');
        
        document.querySelectorAll('.slide').forEach((s, i) => s.classList.toggle('active', i === index));
        
        const titleEl = document.getElementById('main-chart-title'); 
        const sbControls = document.getElementById('sunburst-controls');
        const filters = document.getElementById('filter-list'); 
        const genericControls = document.getElementById('generic-controls');
        const filmControls = document.getElementById('film-controls'); 
        const metaControls = document.getElementById('meta-controls');
        const stdCard = document.getElementById('std-card'); 
        const tvCard = document.getElementById('tv-card');
        
        document.getElementById('analysis-overlay').classList.remove('visible'); 

        if (index === 3) { 
            stdCard.style.display = 'none'; 
            tvCard.style.display = 'block'; 
        } else { 
            stdCard.style.display = 'flex'; 
            tvCard.style.display = 'none'; 
        }
        
        if (index === 2) { 
            genericControls.style.display = 'none';
            filmControls.style.display = 'none';
            sbControls.style.display = 'none';
            metaControls.style.display = 'block'; 
            this.initMetaControls(); 
        } else if (index === 3) { 
            genericControls.style.display = 'none'; 
            metaControls.style.display = 'none';
            filmControls.style.display = 'block';
        } else if (index === 4) {
            genericControls.style.display = 'block';
            metaControls.style.display = 'none';
            filmControls.style.display = 'none';
            sbControls.style.display = 'none';
        } else { 
            genericControls.style.display = 'block'; 
            metaControls.style.display = 'none';
            filmControls.style.display = 'none'; 
            sbControls.style.display = (index === 1) ? 'block' : 'none';
        }
        
        this.updateStats([]); 

        if (index === 0) {
            titleEl.innerText = "PARITÉ TEMPS DE PAROLE MÉDIAS"; 
            filters.style.display = 'flex';
            this.updateCard({title: "Vue d'ensemble", desc: "Temps de parole H/F par groupe média."});
            const groups = this.dataChaines.map(d => d.group); 
            this.renderFilters(groups); 
            this.applyCurrentViewFilters();
        } else if (index === 1) {
            titleEl.innerText = "HIÉRARCHIE DES MÉDIAS (DÉTAIL)"; 
            filters.style.display = 'none'; 
            this.updateCard({title: "Hiérarchie", desc: "Cliquez sur les arcs pour zoomer dans les groupes."});
            
            const groups = ["Tous", ...new Set(this.dataChaines.map(d => d.group).filter(x=>x))];
            const gContainer = document.getElementById('sunburst-groups'); 
            gContainer.innerHTML = '';
            
            groups.forEach(g => {
                const btn = document.createElement('button'); 
                btn.className = 'retro-btn ' + (this.activeSunburstGroups.has(g) ? 'active' : ''); 
                btn.innerText = g;
                btn.onclick = () => { 
                    if(g === 'Tous') {
                        this.activeSunburstGroups.clear();
                        this.activeSunburstGroups.add('Tous');
                    } else {
                        if(this.activeSunburstGroups.has('Tous')) this.activeSunburstGroups.delete('Tous');
                        if(this.activeSunburstGroups.has(g)) this.activeSunburstGroups.delete(g);
                        else this.activeSunburstGroups.add(g);
                        if(this.activeSunburstGroups.size === 0) this.activeSunburstGroups.add('Tous');
                    }
                    gContainer.querySelectorAll('.retro-btn').forEach(b => {
                        if(this.activeSunburstGroups.has(b.innerText)) b.classList.add('active');
                        else b.classList.remove('active');
                    });
                    Viz.renderSunburst(this.activeGender, this.activeSunburstGroups); 
                };
                gContainer.appendChild(btn);
            });
            Viz.renderSunburst(this.activeGender, this.activeSunburstGroups);
        } else if (index === 2) {
            titleEl.innerText = "HIERARCHICAL EDGE BUNDLING"; 
            filters.style.display = 'none'; 
            this.updateCard({title: "Interconnexions", desc: "Visualisation des liens complexes du réseau."});
            Viz.renderEdgeBundlingMeta(App.dataMeta); 
        } else if (index === 3) {
            titleEl.innerText = "FILMS LES PLUS DIFFUSÉS"; 
            this.updateCard({title: "Cinéma TV", desc: "Survolez les barres pour voir les détails sur la TV."}); 
            this.filterFilmsData();
        } else if (index === 4) {
            titleEl.innerText = "RÉPARTITION PAR GENRE DE PROGRAMME";
            filters.style.display = 'none';
            this.updateCard({title: "Genre de Programme", desc: "Parité hommes/femmes par format d'émission."});
            Viz.renderRadialStacked(App.dataGenres);
        }
        document.getElementById('reset-container').style.display = 'none';
    },

    renderFilters(items) {
        const uniqueItems = ["Tous", ...new Set(items.map(x => x ? x.trim() : x))].filter(x => x); 
        const container = document.getElementById('filter-list'); 
        container.innerHTML = '';
        
        const btnAll = document.createElement('button'); 
        btnAll.className = 'retro-btn ' + (this.activeFilters.has('Tous') ? 'active' : ''); 
        btnAll.innerText = 'Tous';
        btnAll.onclick = () => { 
            this.activeFilters.clear(); 
            this.activeFilters.add('Tous'); 
            this.updateFilterButtons(); 
            this.applyCurrentViewFilters(); 
        };
        container.appendChild(btnAll);
        
        uniqueItems.filter(i => i !== "Tous").forEach(item => {
            const btn = document.createElement('button'); 
            btn.className = 'retro-btn ' + (this.activeFilters.has(item) ? 'active' : ''); 
            btn.innerText = item;
            btn.onclick = () => { 
                if(this.activeFilters.has('Tous')) this.activeFilters.delete('Tous'); 
                if(this.activeFilters.has(item)) this.activeFilters.delete(item); 
                else this.activeFilters.add(item); 
                if(this.activeFilters.size === 0) this.activeFilters.add('Tous'); 
                this.updateFilterButtons(); 
                this.applyCurrentViewFilters(); 
            };
            container.appendChild(btn);
        });
    },

    updateFilterButtons() { 
        const btns = document.querySelectorAll('#filter-list .retro-btn'); 
        btns.forEach(b => { 
            const val = b.innerText; 
            if(this.activeFilters.has(val)) b.classList.add('active'); 
            else b.classList.remove('active'); 
        }); 
    },

    applyCurrentViewFilters() {
        if(this.currentSlide === 0) { 
            let filteredData = this.dataChaines; 
            if(!this.activeFilters.has('Tous')) { 
                filteredData = this.dataChaines.filter(d => this.activeFilters.has(d.group)); 
            } 
            Viz.renderChord(filteredData); 
        } 
    },

    toggleGender(gender) {
        this.activeGender = gender; 
        const sbDiv = document.getElementById('sunburst-controls'); 
        if(sbDiv) sbDiv.querySelectorAll('div:first-of-type .retro-btn').forEach(b => b.classList.remove('active'));
        
        if (gender === 'H') document.getElementById('btn-h').classList.add('active'); 
        else if (gender === 'F') document.getElementById('btn-f').classList.add('active'); 
        else document.getElementById('btn-all').classList.add('active');
        
        if(this.currentSlide === 1) Viz.renderSunburst(gender, this.activeSunburstGroups);
    },

    filterFilmsData() {
        const country = document.getElementById('country-select').value; 
        const yearMin = +document.getElementById('year-min').value; 
        const diffYear = document.getElementById('diff-select').value;
        document.getElementById('year-val').innerText = yearMin;
        let filtered = this.dataFilms.filter(d => {
            let matchCountry = true; 
            if(country === 'FR') matchCountry = (d.Country === 'FR'); 
            else if(country === 'US') matchCountry = (d.Country.includes('US')); 
            else if(country === 'IT') matchCountry = (d.Country.includes('IT')); 
            else if(country === 'coprod') matchCountry = (d.Country.includes('/'));
            const matchYear = (d.Year >= yearMin); 
            let matchDiff = true; 
            if(diffYear !== 'all') matchDiff = (d.LastDiffusion === +diffYear);
            return matchCountry && matchYear && matchDiff;
        });
        Viz.renderRadialFilms(filtered); 
        this.updateStats(filtered.map(d => d.Diffusions));
    },

    updateStats(values) {
        const numValues = values.map(v => Number(v)).filter(v => !isNaN(v));
        
        if (numValues.length === 0) { 
            ['mean', 'med', 'std', 'var', 'max'].forEach(id => {
                const el = document.getElementById('stat-' + id);
                if(el) el.innerText = "--";
            });
            return; 
        }

        const mean = math.mean(numValues);
        const median = math.median(numValues);
        const std = math.std(numValues);
        const variance = math.variance(numValues);
        const max = math.max(numValues);

        document.getElementById('stat-mean').innerText = mean.toFixed(1);
        document.getElementById('stat-med').innerText = median.toFixed(1);
        document.getElementById('stat-std').innerText = std.toFixed(1);
        document.getElementById('stat-var').innerText = variance.toFixed(1);
        document.getElementById('stat-max').innerText = max.toFixed(0);
    },

    populateStatsModal() {
        const meanVal = document.getElementById('stat-mean').innerText;
        const medVal = document.getElementById('stat-med').innerText;
        const stdVal = document.getElementById('stat-std').innerText;
        const varVal = document.getElementById('stat-var').innerText;
        const maxVal = document.getElementById('stat-max').innerText;

        const slideNames = [
            "Parité temps de parole (Chord Diagram)",
            "Hiérarchie des médias (Sunburst)",
            "Edge Bundling relationnel",
            "Films les plus diffusés (Radial)",
            "Répartition par genre (Radial Stacked)"
        ];
        const slideName = slideNames[this.currentSlide] || "Visualisation";
        const isFilms = this.currentSlide === 3;
        const unit = isFilms ? "diffusions" : "secondes de temps de parole";

        const ctx = document.getElementById('stats-modal-context');
        ctx.innerHTML = `Voici l'interprétation des résultats statistiques calculés sur la vue active : <strong>${slideName}</strong>. Les valeurs sont exprimées en <strong>${unit}</strong>.`;

        const noData = meanVal === "--";
        const body = document.getElementById('stats-modal-body');

        if(noData) {
            body.innerHTML = `<div class="stats-modal-item"><p>Aucune donnée statistique disponible pour cette vue. Changez de visualisation ou de filtres pour obtenir des résultats.</p></div>`;
            return;
        }

        const mean = parseFloat(meanVal);
        const med = parseFloat(medVal);
        const std = parseFloat(stdVal);
        const max = parseFloat(maxVal);

        // Interpretation of mean vs median
        const diff = Math.abs(mean - med);
        const diffPct = mean > 0 ? ((diff / mean) * 100).toFixed(1) : 0;
        let symmetryText = "";
        if(diffPct < 5) {
            symmetryText = `La moyenne et la médiane sont très proches (écart de ${diffPct}%), ce qui indique une <strong>distribution symétrique</strong> et équilibrée des données.`;
        } else if(mean > med) {
            symmetryText = `La moyenne (${meanVal}) est supérieure à la médiane (${medVal}), avec un écart de ${diffPct}%. Cela révèle une <strong>distribution asymétrique à droite</strong> : quelques valeurs très élevées tirent la moyenne vers le haut.`;
        } else {
            symmetryText = `La moyenne (${meanVal}) est inférieure à la médiane (${medVal}), avec un écart de ${diffPct}%. Cela indique une <strong>distribution asymétrique à gauche</strong> : certaines valeurs très basses font baisser la moyenne.`;
        }

        // CV interpretation
        const cv = mean > 0 ? ((std / mean) * 100).toFixed(1) : 0;
        let dispersionText = "";
        if(cv < 20) {
            dispersionText = `Le coefficient de variation est de <strong>${cv}%</strong>, ce qui indique une <strong>faible dispersion</strong> : les valeurs sont relativement homogènes entre elles.`;
        } else if(cv < 50) {
            dispersionText = `Le coefficient de variation est de <strong>${cv}%</strong>, ce qui montre une <strong>dispersion modérée</strong> : il existe des différences notables entre les éléments.`;
        } else {
            dispersionText = `Le coefficient de variation est de <strong>${cv}%</strong>, révélant une <strong>très forte dispersion</strong> : les valeurs sont extrêmement hétérogènes, avec de grands écarts entre les éléments.`;
        }

        // Max interpretation
        const maxRatio = mean > 0 ? (max / mean).toFixed(1) : 0;
        let maxText = `La valeur maximale observée est <strong>${maxVal}</strong>, soit <strong>${maxRatio}×</strong> la moyenne. `;
        if(maxRatio > 3) {
            maxText += `C'est un cas extrême qui dépasse largement la tendance générale.`;
        } else if(maxRatio > 1.5) {
            maxText += `Ce leader se démarque nettement du reste du groupe.`;
        } else {
            maxText += `Cette valeur reste proche de la tendance centrale, indiquant un ensemble relativement homogène.`;
        }

        body.innerHTML = `
            <div class="stats-modal-item">
                <div class="stats-modal-item-title"><i class="fas fa-calculator"></i> Moyenne = ${meanVal}</div>
                <p>En moyenne, chaque élément de cette sélection totalise <strong>${meanVal} ${unit}</strong>.</p>
                <p class="stats-modal-formula">μ = (Σxᵢ) / n</p>
                <p class="stats-modal-why">→ C'est le point d'équilibre de l'ensemble des données.</p>
            </div>
            <div class="stats-modal-item">
                <div class="stats-modal-item-title"><i class="fas fa-arrows-alt-h"></i> Médiane = ${medVal}</div>
                <p>La valeur centrale de la série est <strong>${medVal}</strong>. La moitié des éléments sont en dessous, l'autre moitié au dessus.</p>
                <p class="stats-modal-why">→ ${symmetryText}</p>
            </div>
            <div class="stats-modal-item">
                <div class="stats-modal-item-title"><i class="fas fa-expand-arrows-alt"></i> Écart-Type = ${stdVal}</div>
                <p>Les valeurs s'écartent en moyenne de <strong>${stdVal} ${unit}</strong> par rapport à la moyenne.</p>
                <p class="stats-modal-formula">σ = √(Σ(xᵢ - μ)² / n)</p>
                <p class="stats-modal-why">→ ${dispersionText}</p>
            </div>
            <div class="stats-modal-item">
                <div class="stats-modal-item-title"><i class="fas fa-chart-area"></i> Variance = ${varVal}</div>
                <p>La variance (carré de l'écart-type) est <strong>${varVal}</strong>. Plus cette valeur est élevée, plus les données sont dispersées.</p>
                <p class="stats-modal-formula">σ² = Σ(xᵢ - μ)² / n</p>
                <p class="stats-modal-why">→ Utile pour les tests statistiques et comparaisons entre jeux de données.</p>
            </div>
            <div class="stats-modal-item">
                <div class="stats-modal-item-title"><i class="fas fa-arrow-up"></i> Maximum = ${maxVal}</div>
                <p>${maxText}</p>
                <p class="stats-modal-why">→ Identifie l'élément dominant de la sélection actuelle.</p>
            </div>
        `;
    },

    updateCard(data) {
        const isTV = document.getElementById('tv-card').style.display === 'block'; 
        const title = data.title; 
        const desc = data.desc;
        const localLogo = App.mediaLogos && App.mediaLogos[title] ? App.mediaLogos[title] : null;
        const domain = MEDIA_DOMAINS[title] || null; 
        const realLogo = localLogo ? localLogo : (domain ? 'https://logo.clearbit.com/' + domain : null); 
        const logoUrl = data.Poster ? data.Poster : (realLogo ? realLogo : "");

        if(isTV) { 
            document.getElementById('tv-card-title').innerText = title; 
            document.getElementById('tv-card-desc').innerHTML = desc; 
            document.getElementById('tv-bg-image').src = logoUrl; 
        } else {
            document.getElementById('sc-title').innerText = title; 
            document.getElementById('sc-desc').innerHTML = desc;
            const imgEl = document.getElementById('sc-img'); 
            const iconEl = document.getElementById('sc-icon');
            
            if(logoUrl && !logoUrl.includes('ui-avatars')) { 
                imgEl.src = logoUrl; 
                imgEl.classList.remove('hidden'); 
                iconEl.style.display = 'none'; 
            } else { 
                imgEl.src = ""; 
                imgEl.classList.add('hidden'); 
                iconEl.style.display = 'block'; 
                if(data.men !== undefined) iconEl.className = "fas fa-chart-pie sc-placeholder-icon"; 
                else iconEl.className = "fas fa-film sc-placeholder-icon"; 
            }
            
            const scGender = document.getElementById('sc-gender-box');
            if(data.men !== undefined && data.women !== undefined) {
                const total = data.men + data.women; 
                const pctMen = total > 0 ? Math.round((data.men / total) * 100) : 0; 
                const pctWomen = total > 0 ? 100 - pctMen : 0;
                document.getElementById('sc-bar-men').style.width = pctMen + "%"; 
                document.getElementById('sc-bar-women').style.width = pctWomen + "%"; 
                scGender.style.opacity = 1;
            } else { 
                scGender.style.opacity = 0.3; 
            }
        }
    },

    toggleSelection(id, value, name) { 
        if (this.selectedIds.has(id)) this.selectedIds.delete(id); 
        else this.selectedIds.add(id); 
        document.getElementById('reset-container').style.display = this.selectedIds.size > 0 ? 'block' : 'none'; 
        return this.selectedIds; 
    }
};

const Viz = {
    showTooltip(e, content) { 
        const tt = document.getElementById('viz-tooltip'); 
        tt.innerHTML = content; 
        tt.style.opacity = 1; 
        tt.style.left = (e.pageX + 15) + "px"; 
        tt.style.top = (e.pageY + 15) + "px"; 
    },
    moveTooltip(e) { 
        const tt = document.getElementById('viz-tooltip'); 
        tt.style.left = (e.pageX + 15) + "px"; 
        tt.style.top = (e.pageY + 15) + "px"; 
    },
    hideTooltip() { 
        const tt = document.getElementById('viz-tooltip'); 
        tt.style.opacity = 0; 
    },

    renderChord(data) {
        const container = document.getElementById('chart-chord'); 
        if(!container) return; 
        container.innerHTML = ''; 
        
        const width = container.clientWidth, 
              height = container.clientHeight, 
              size = Math.min(width, height) * 0.92; 
        const innerR = size * 0.4, 
              outerR = innerR + 15;

        if(data.length === 0) { 
            container.innerHTML = "<div style='display:flex;justify-content:center;align-items:center;height:100%;font-style:italic;color:var(--text-main);opacity:0.6'>Aucune donnée pour cette sélection</div>"; 
            return; 
        }
        
        const colTotal = "total_declarations_duration_2020"; 
        let validData = data.filter(d => parseFloat(d[colTotal]) > 0); 
        const topData = validData.sort((a,b) => parseFloat(b[colTotal]) - parseFloat(a[colTotal])).slice(0, 15);
        
        const entities = ["Hommes", "Femmes", ...topData.map(d => d.Editeur)]; 
        const matrix = Array(entities.length).fill().map(() => Array(entities.length).fill(0));
        const rawDataMap = {};
        
        const statsArray = [];

        topData.forEach((d, i) => {
            const idx = i + 2; 
            const m = parseFloat(d.men_speech_duration_2020)||0; 
            const f = parseFloat(d.women_speech_duration_2020)||0;
            matrix[0][idx] = m; 
            matrix[idx][0] = m; 
            matrix[1][idx] = f; 
            matrix[idx][1] = f; 
            rawDataMap[idx] = { name: d.Editeur, men: m, women: f, desc: `Catégorie: ${d.group}` };
            statsArray.push(m + f);
        });
        
        App.updateStats(statsArray);

        const chord = d3.chord().padAngle(0.04).sortSubgroups(d3.descending)(matrix);
        const arc = d3.arc().innerRadius(innerR).outerRadius(outerR);
        const ribbon = d3.ribbon().radius(innerR);
        
        const colorPalette = d3.scaleOrdinal(COLORS.palette);
        const color = i => i===0 ? COLORS.men : (i===1 ? COLORS.women : colorPalette(i));

        const svg = d3.select(container).append("svg").attr("viewBox", [-width/2, -height/2, width, height]);
        const group = svg.append("g").selectAll("g").data(chord.groups).join("g");
        
        group.append("path")
            .attr("class", "chord-group")
            .attr("d", arc)
            .style("fill", d => color(d.index))
            .style("stroke", "var(--bg-color)")
            .on("click", (e, d) => { e.stopPropagation(); App.toggleSelection(d.index, d.value, entities[d.index]); this.updateVisualsChord(svg); })
            .on("mouseover", (e, d) => {
                svg.selectAll(".chord-ribbon").style("opacity", 0.1).filter(r => r.source.index === d.index || r.target.index === d.index).style("opacity", 0.9).style("stroke", "#000");
                const info = rawDataMap[d.index]; 
                let tooltipHtml = "";
                if(info) {
                    const total = info.men + info.women; 
                    const pctM = total > 0 ? Math.round((info.men/total)*100) : 0; 
                    const pctF = total > 0 ? 100 - pctM : 0;
                    tooltipHtml = `<div class="tooltip-title">${info.name}</div><div class="tooltip-row"><span style="color:${COLORS.men}">Hommes</span> <span>${info.men.toFixed(0)}h (${pctM}%)</span></div><div class="tooltip-row"><span style="color:${COLORS.women}">Femmes</span> <span>${info.women.toFixed(0)}h (${pctF}%)</span></div>`;
                    App.updateCard({title: info.name, desc: info.desc, men: info.men, women: info.women});
                } else if(d.index === 0) { 
                    tooltipHtml = `<div class="tooltip-title">TOTAL HOMMES</div><div>${d.value.toFixed(0)} heures cumulées</div>`; 
                    App.updateCard({title: "HOMMES", desc: "Temps de parole global des hommes.", men: 100, women: 0}); 
                } else if(d.index === 1) { 
                    tooltipHtml = `<div class="tooltip-title">TOTAL FEMMES</div><div>${d.value.toFixed(0)} heures cumulées</div>`; 
                    App.updateCard({title: "FEMMES", desc: "Temps de parole global des femmes.", men: 0, women: 100}); 
                }
                this.showTooltip(e, tooltipHtml);
            })
            .on("mousemove", (e) => { this.moveTooltip(e); })
            .on("mouseout", () => { this.hideTooltip(); svg.selectAll(".chord-ribbon").style("opacity", 0.7).style("stroke", "none"); if(App.selectedIds.size > 0) this.updateVisualsChord(svg); });

        group.append("text").each(d => { d.angle = (d.startAngle + d.endAngle) / 2; }).attr("dy", ".35em").attr("class", "chord-label")
            .attr("transform", d => `rotate(${(d.angle * 180 / Math.PI - 90)}) translate(${outerR + 10}) ${d.angle > Math.PI ? "rotate(180)" : ""}`)
            .attr("text-anchor", d => d.angle > Math.PI ? "end" : "start").text(d => entities[d.index]);

        svg.append("g").selectAll("path").data(chord).join("path").attr("d", ribbon).attr("class", "chord-ribbon")
            .style("fill", d => color(d.source.index)).style("stroke", "none").style("mix-blend-mode", "multiply").style("opacity", 0.7)
            .on("mouseover", (e, d) => { 
                d3.select(e.target).style("opacity", 1); 
                const sourceName = entities[d.source.index]; 
                const targetName = entities[d.target.index]; 
                const val = d.source.value;
                const tooltipHtml = `<div class="tooltip-title">FLUX</div><div class="tooltip-row">${sourceName} <i class="fas fa-arrow-right"></i> ${targetName}</div><div style="font-weight:900; font-size:1.1em">${val.toFixed(1)} heures</div>`;
                this.showTooltip(e, tooltipHtml);
            })
            .on("mousemove", (e) => { this.moveTooltip(e); }).on("mouseout", (e) => { this.hideTooltip(); d3.select(e.target).style("opacity", 0.7); });
    },

    updateVisualsChord(svg) {
        if (App.selectedIds.size === 0) { svg.selectAll("path").classed("dimmed", false); return; }
        svg.selectAll(".chord-group").classed("dimmed", d => !App.selectedIds.has(d.index));
        svg.selectAll(".chord-ribbon").classed("dimmed", d => !App.selectedIds.has(d.source.index) && !App.selectedIds.has(d.target.index));
    },

    renderSunburst(gender, groupFilter) {
        const container = document.getElementById('chart-sunburst'); 
        if(!container) return; 
        container.innerHTML = '';
        
        const width = container.clientWidth, height = container.clientHeight, radius = Math.min(width, height) / 2.2;
        const hierarchy = { name: "TOTAL", children: [] }; const map = new Map(), lookup = {};
        const statsArray = [];

        App.dataChaines.forEach(d => {
            if(!groupFilter.has('Tous') && !groupFilter.has(d.group)) return;
            const g = d.group || "Autre"; 
            const men = parseFloat(d.men_speech_duration_2020)||0, women = parseFloat(d.women_speech_duration_2020)||0;
            lookup[d.Editeur] = { men: men, women: women, group: g }; 
            if(!map.has(g)) map.set(g, { name: g, children: [] });
            let val = (gender === 'ALL') ? men + women : (gender === 'H' ? men : women); 
            if(val > 0) { 
                map.get(g).children.push({ name: d.Editeur, value: val }); 
                statsArray.push(val);
            }
        });
        
        App.updateStats(statsArray);

        hierarchy.children = Array.from(map.values());
        const root = d3.hierarchy(hierarchy).sum(d => d.value).sort((a,b) => b.value - a.value);
        d3.partition().size([2*Math.PI, radius*radius])(root);
        const arc = d3.arc().startAngle(d => d.x0).endAngle(d => d.x1).innerRadius(d => Math.sqrt(d.y0)).outerRadius(d => Math.sqrt(d.y1));
        const svg = d3.select(container).append("svg").attr("viewBox", [-width/2, -height/2, width, height]);

        // Color scale: one distinct color per group (depth 1)
        const groups = root.children ? root.children.map(d => d.data.name) : [];
        const groupColorScale = d3.scaleOrdinal().domain(groups).range(COLORS.palette);

        // Get group color for any node
        const getGroupColor = (d) => {
            if(d.depth === 1) return groupColorScale(d.data.name);
            if(d.depth === 2 && d.parent) {
                const base = d3.color(groupColorScale(d.parent.data.name));
                // Get index among siblings for variation
                const siblings = d.parent.children || [];
                const idx = siblings.indexOf(d);
                const total = siblings.length;
                // Create shade variations: lighten progressively
                const t = total > 1 ? idx / (total - 1) : 0.5;
                return d3.interpolateRgb(base, base.brighter(1.5))(t);
            }
            return "#999";
        };

        const cell = svg.selectAll("g").data(root.descendants().filter(d => d.depth)).join("g");

        cell.append("path").attr("d", arc).attr("class", "sunburst-arc")
            .style("fill", d => getGroupColor(d))
            .on("click", (e, d) => { e.stopPropagation(); App.toggleSelection(d.data.name, d.value, d.data.name); this.updateVisualsSunburst(svg); })
            .on("mouseover", (e, d) => {
                this.updateBreadcrumbs(d, root.value); d3.selectAll(".sunburst-arc").style("opacity", 0.3); d3.select(e.target).style("opacity", 1);
                // Also highlight sibling arcs from same group
                if(d.depth === 2 && d.parent) {
                    d.parent.children.forEach(sibling => {
                        svg.selectAll(".sunburst-arc").filter(s => s === sibling).style("opacity", 0.6);
                    });
                }
                d3.select(e.target).style("opacity", 1);
                const info = lookup[d.data.name]; 
                if(info) App.updateCard({title: d.data.name, desc: `Groupe: ${info.group}`, men: info.men, women: info.women}); 
                else App.updateCard({title: d.data.name, desc: "Groupe de chaînes", logo: null});
            })
            .on("mouseout", () => { document.getElementById('sunburst-breadcrumbs').innerHTML = ""; d3.selectAll(".sunburst-arc").style("opacity", 1); if(App.selectedIds.size > 0) this.updateVisualsSunburst(svg); });
        // ── TEXT LABELS INSIDE ARCS ────────────────────────────────────
        const defs = svg.append("defs");
        let labelId = 0;

        cell.each(function(d) {
            const angleSpan = d.x1 - d.x0;
            const innerR    = Math.sqrt(d.y0);
            const outerR    = Math.sqrt(d.y1);
            const midR      = (innerR + outerR) / 2;
            const arcLen    = angleSpan * midR;
            const thickness = outerR - innerR;

            // Minimum arc sizes for legibility
            if (arcLen < (d.depth === 1 ? 45 : 30) || thickness < (d.depth === 1 ? 16 : 11)) return;

            const id  = "sl-" + (labelId++);
            const grp = d3.select(this);

            // Flip text for bottom half so it reads left→right
            const mid   = (d.x0 + d.x1) / 2;
            const flip  = mid > Math.PI;
            const sa    = flip ? d.x1 : d.x0;
            const ea    = flip ? d.x0 : d.x1;

            defs.append("path")
                .attr("id", id)
                .attr("d", d3.arc().innerRadius(midR).outerRadius(midR)
                    .startAngle(sa).endAngle(ea)());

            // Truncate name to available space
            const fsize    = d.depth === 1 ? 10 : 8;
            const cw       = d.depth === 1 ? 7.5 : 6;
            const maxChars = Math.floor((Math.abs(ea - sa) * midR) / cw);
            const name     = d.data.name;
            const label    = name.length > maxChars
                ? name.substring(0, Math.max(maxChars - 1, 3)) + "…"
                : name;

            // Adaptive text color
            const bg  = d3.color(getGroupColor(d));
            const lum = bg.r * 0.299 + bg.g * 0.587 + bg.b * 0.114;
            const col = lum > 155 ? "#111" : "#fff";

            grp.append("text")
                .style("font-size",   fsize + "px")
                .style("font-weight", d.depth === 1 ? "700" : "500")
                .style("fill",        col)
                .style("pointer-events", "none")
                .style("letter-spacing", "0.05em")
                .append("textPath")
                    .attr("href",        "#" + id)
                    .attr("startOffset", "50%")
                    .attr("text-anchor", "middle")
                    .text(label);
        });
    },

    updateBreadcrumbs(node, totalValue) {
        const bContainer = document.getElementById('sunburst-breadcrumbs'); 
        bContainer.innerHTML = '';
        const sequence = node.ancestors().reverse(); 
        sequence.shift(); 
        // Build a local color map to match sunburst colors
        const groups = [...new Set(App.dataChaines.map(d => d.group).filter(x=>x))];
        const gColorScale = d3.scaleOrdinal().domain(groups).range(CUSTOM_PALETTE);
        sequence.forEach((d, i) => {
            const el = document.createElement('div'); 
            el.className = 'breadcrumb-item'; 
            // Determine the group color
            const groupName = d.depth === 1 ? d.data.name : (d.parent ? d.parent.data.name : null);
            const bgColor = groupName ? gColorScale(groupName) : '#333';
            const base = d3.color(bgColor);
            const brightness = base.r * 0.299 + base.g * 0.587 + base.b * 0.114;
            const textColor = brightness > 150 ? '#000' : '#fff';
            el.style.background = bgColor;
            el.style.color = textColor;
            el.innerHTML = `<span>${d.data.name}</span>`;
            if (i === sequence.length - 1) { 
                const pct = ((d.value / totalValue) * 100).toFixed(1); 
                el.innerHTML += `<span class="breadcrumb-pct" style="background:${textColor};color:${bgColor}">${pct}%</span>`; 
            }
            bContainer.appendChild(el);
        });
    },

    updateVisualsSunburst(svg) { 
        if (App.selectedIds.size === 0) { svg.selectAll(".sunburst-arc").classed("dimmed", false); return; } 
        svg.selectAll(".sunburst-arc").classed("dimmed", d => !App.selectedIds.has(d.data.name)); 
    },

    renderEdgeBundlingMeta(data) {
        const container = document.getElementById('chart-bundling');
        if (!container || !data || data.length === 0) return;
        container.innerHTML = '';

        const width = container.clientWidth;
        const height = container.clientHeight;
        
        const radius = Math.min(width, height) / 2.8;

        const keys = Object.keys(data[0]);
        const sourceKey = keys[0];
        const targetKey = keys[1] || keys[0];

        const vibrantColors = CUSTOM_PALETTE; 
        const color = d3.scaleOrdinal(vibrantColors);

        const nodesMap = new Map();
        const addToMap = (n) => {
            if(!nodesMap.has(n)) nodesMap.set(n, {name: n, imports: []});
        };

        data.forEach(d => {
            const source = d[sourceKey];
            const target = d[targetKey];
            if(source && target && source !== target) {
                addToMap(source);
                addToMap(target);
                nodesMap.get(source).imports.push(target);
            }
        });

        const rootData = {
            name: "root",
            children: Array.from(nodesMap.values()).map(d => ({name: d.name, imports: d.imports}))
        };

        const hierarchy = d3.hierarchy(rootData);
        
        const cluster = d3.cluster().size([2 * Math.PI, radius - 100]);
        const root = cluster(hierarchy);

        const map = new Map(root.leaves().map(d => [d.data.name, d]));
        
        const links = [];
        root.leaves().forEach(d => {
            if (d.data.imports) {
                d.data.imports.forEach(i => {
                    if (map.get(i)) {
                        links.push(d.path(map.get(i)));
                    }
                });
            }
        });

        const svg = d3.select(container).append("svg")
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .style("font", "10px sans-serif");

        const line = d3.lineRadial()
            .curve(d3.curveBundle.beta(0.85))
            .radius(d => d.y)
            .angle(d => d.x);

        const link = svg.append("g")
            .attr("fill", "none")
            .selectAll("path")
            .data(links)
            .join("path")
            .attr("class", "link-path")
            .style("stroke", d => color(d[0].data.name)) 
            .style("stroke-width", "3px") 
            .attr("d", line);

        const node = svg.append("g")
            .selectAll("g")
            .data(root.leaves())
            .join("g")
            .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
            .append("text")
            .attr("dy", "0.31em")
            .attr("x", d => d.x < Math.PI ? 6 : -6)
            .attr("text-anchor", d => d.x < Math.PI ? "start" : "end")
            .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
            .text(d => d.data.name)
            .attr("fill", "#333")
            .style("font-weight", "bold")
            .style("cursor", "pointer")
            .on("mouseover", (event, d) => {
                link.style("stroke-opacity", 0.05);
                link.filter(l => l[0] === d || l[l.length - 1] === d)
                    .style("stroke-opacity", 1)
                    .style("stroke-width", "6px") 
                    .raise(); 
                App.updateCard({title: d.data.name, desc: "Élément du réseau relationnel."});
            })
            .on("mouseout", () => {
                link.style("stroke-opacity", 0.5)
                    .style("stroke-width", "3px");
            });
        
        App.updateStats([]);
    },

    renderRadialFilms(data) {
        const container = document.getElementById('chart-films'); 
        if(!container) return; 
        container.innerHTML = '';
        
        data.sort((a,b) => b.Diffusions - a.Diffusions);
        
        const width = container.clientWidth, height = container.clientHeight; 
        const innerRadius = 130, outerRadius = Math.min(width, height) / 2 - 20;
        
        const svg = d3.select(container).append("svg").attr("width", width).attr("height", height).append("g").attr("transform", `translate(${width / 2},${height / 2})`);
        const x = d3.scaleBand().range([0, 2 * Math.PI]).align(0).domain(data.map(d => d.Title));
        let y = (typeof d3.scaleRadial === 'function') ? d3.scaleRadial().range([innerRadius, outerRadius]).domain([0, d3.max(data, d => d.Diffusions) || 10]) : d3.scaleLinear().range([innerRadius, outerRadius]).domain([0, d3.max(data, d => d.Diffusions) || 10]);
        const maxDiff = d3.max(data, d => d.Diffusions) || 10; 
        
        const colorScale = d3.scaleSequential(d3.interpolateRgbBasis(CUSTOM_PALETTE)).domain([0, maxDiff]); 

        svg.append("g").selectAll("path").data(data).join("path").attr("class", "radial-bar").attr("fill", d => colorScale(d.Diffusions))
            .attr("d", d3.arc().innerRadius(innerRadius).outerRadius(d => y(d.Diffusions)).startAngle(d => x(d.Title)).endAngle(d => x(d.Title) + x.bandwidth()).padAngle(0.02).padRadius(innerRadius))
            .on("mouseover", (e, d) => {
                d3.select(".center-rank").text("#" + d.Rank); 
                d3.select(".center-title").text(d.Title.length > 25 ? d.Title.substring(0,25)+"..." : d.Title);
                d3.select(".center-detail").html(`${d.Director}<br>${d.Year} - ${d.Country}`); 
                d3.select(".center-count").html(`${d.Diffusions} <span style="font-size:0.8rem; vertical-align:middle">DIFF</span>`);
                App.updateCard({ title: d.Title, desc: `<strong>${d.Director}</strong> (${d.Year})<br>${d.Diffusions} diffusions au total.<br>Dernière : ${d.LastDiffusion}`, logo: null, Poster: d.Poster });
                d3.selectAll(".radial-bar").style("opacity", 0.2); 
                d3.select(e.target).style("opacity", 1).style("stroke", "var(--text-main)").raise();
            })
            .on("mouseout", (e) => {
                d3.select(".center-rank").text("INFO"); d3.select(".center-title").text("Survolez un film"); d3.select(".center-detail").text("Visualisation Interactive"); d3.select(".center-count").text("--"); d3.selectAll(".radial-bar").style("opacity", 1).style("stroke", "none");
            });
        
        const yAxis = svg.append("g").attr("text-anchor", "middle").style("pointer-events", "none");
        const ticks = [Math.floor(maxDiff/2), maxDiff]; 
        yAxis.selectAll("circle").data(ticks).join("circle").attr("fill", "none").attr("stroke", "var(--text-main)").attr("stroke-opacity", 0.1).attr("r", y);
        if(data.length === 0) { svg.append("text").text("Aucun résultat").attr("text-anchor","middle").attr("dy", "0.35em"); }
    },

    renderRadialStacked(data) {
        const container = document.getElementById('chart-radial-stacked');
        if(!container) return;
        container.innerHTML = '';
        
        let validData = data.filter(d => d.genre && (parseFloat(d.women_speech_duration_2020) > 0 || parseFloat(d.men_speech_duration_2020) > 0));
        
        validData = validData.map(d => ({
            genre: d.genre,
            F: parseFloat(d.women_speech_duration_2020) || 0,
            H: parseFloat(d.men_speech_duration_2020) || 0,
            total: (parseFloat(d.women_speech_duration_2020) || 0) + (parseFloat(d.men_speech_duration_2020) || 0)
        })).sort((a, b) => b.total - a.total);
        
        const width = container.clientWidth, height = container.clientHeight;
        const innerRadius = 130, outerRadius = Math.min(width, height) / 2 - 40;
        
        const svg = d3.select(container).append("svg")
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .attr("width", width)
            .attr("height", height);
            
        const defs = svg.append("defs");
        const gradientF = defs.append("linearGradient").attr("id", "gradF").attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%");
        gradientF.append("stop").attr("offset", "0%").attr("stop-color", "#F44336");
        gradientF.append("stop").attr("offset", "100%").attr("stop-color", "#FF8A80");
        
        const gradientH = defs.append("linearGradient").attr("id", "gradH").attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%");
        gradientH.append("stop").attr("offset", "0%").attr("stop-color", "#2196F3");
        gradientH.append("stop").attr("offset", "100%").attr("stop-color", "#80D8FF");

        const x = d3.scaleBand()
            .domain(validData.map(d => d.genre))
            .range([0, 2 * Math.PI])
            .align(0);

        const y = (typeof d3.scaleRadial === 'function') ? d3.scaleRadial()
            .domain([0, d3.max(validData, d => d.total)])
            .range([innerRadius, outerRadius]) : d3.scaleLinear().domain([0, d3.max(validData, d => d.total)]).range([innerRadius, outerRadius]);

        const arc = d3.arc()
            .innerRadius(d => y(d[0]))
            .outerRadius(d => y(d[1]))
            .startAngle(d => x(d.data.genre))
            .endAngle(d => x(d.data.genre) + x.bandwidth())
            .padAngle(0.01)
            .padRadius(innerRadius);

        const series = d3.stack().keys(["H", "F"])(validData);

        const colorScale = d3.scaleOrdinal()
            .domain(["H", "F"])
            .range(["url(#gradH)", "url(#gradF)"]);

        const g = svg.append("g")
            .selectAll("g")
            .data(series)
            .join("g")
            .attr("fill", d => colorScale(d.key))
            .selectAll("path")
            .data(d => d)
            .join("path")
            .attr("d", arc)
            .attr("class", "radial-stacked-path")
            .on("mouseover", function(e, d) {
                d3.selectAll(".radial-stacked-path").style("opacity", 0.3);
                d3.select(this).style("opacity", 1);
                const genreData = d.data;
                const pctF = ((genreData.F / genreData.total) * 100).toFixed(1);
                const pctH = ((genreData.H / genreData.total) * 100).toFixed(1);
                App.updateCard({
                    title: genreData.genre, 
                    desc: `Total: ${(genreData.total/3600).toFixed(0)}h<br><span style="color:#2196F3">Hommes: ${pctH}%</span> | <span style="color:#F44336">Femmes: ${pctF}%</span>`
                });
            })
            .on("mouseout", function() {
                d3.selectAll(".radial-stacked-path").style("opacity", 1);
                App.updateCard({title: "Genre de Programme", desc: "Parité hommes/femmes par format d'émission."});
            });

        const labelGroup = svg.append("g").selectAll("g")
            .data(validData)
            .join("g")
            .attr("text-anchor", d => (x(d.genre) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "start" : "end")
            .attr("transform", d => `
                rotate(${((x(d.genre) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
                translate(${outerRadius + 15},0)
            `);

        labelGroup.append("text")
            .attr("transform", d => (x(d.genre) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "" : "rotate(180)")
            .text(d => d.genre.length > 20 ? d.genre.substring(0, 20) + '...' : d.genre)
            .style("font-size", "11px")
            .style("fill", "var(--text-main)")
            .style("font-weight", "600")
            .style("pointer-events", "none");
            
        App.updateStats(validData.map(d => d.total));
    },

    resetView() { App.selectedIds.clear(); this.clearSelectionStyle(); App.updateCard({title:"Vue Globale", desc:"Sélection réinitialisée."}); document.getElementById('reset-container').style.display = 'none'; d3.selectAll("path").style("opacity", null); d3.selectAll(".bubble").style("opacity", null); },
    clearSelectionStyle() { d3.selectAll(".dimmed").classed("dimmed", false); },
    resetSelection(e) { if(e.target.className.includes && e.target.className.includes('chart-wrapper')) this.resetView(); }
};

App.init();
