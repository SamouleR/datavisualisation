import React, { useState } from 'react';
import { Mistral } from '@mistralai/mistralai';

const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;

// Ensure we don't crash if the key is missing during build
const client = apiKey ? new Mistral({ apiKey }) : null;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Bonjour ! Je suis l'assistant de ce projet de Datavisualisation. Posez-moi vos questions sur les données ou le projet !" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const contextData = `
    Contexte du projet : Vous êtes un assistant d'analyse de données pour le projet "Les Français face à l'information" (SAE 302).
    Auteurs du projet : Samuel Ralaikoa, Kinaya Zakaria, Dienaba Sow.
    RÈGLE STRICTE : Sois extrêmement concis. Fais des réponses très courtes (1 à 2 phrases maximum, pas de longs paragraphes ni de listes à puces superflues).
    Voici les enseignements principaux tirés des données CSV du projet :
    1. Parité de la parole : Disparité persistante. La moyenne du temps de parole féminin reste inférieure à 40%. Les chaînes publiques (France TV) montrent une meilleure équité que le privé.
    2. Hiérarchie des médias : Les groupes majeurs (TF1, M6, France TV) dominent. Forte concentration.
    3. Cinéma à la TV : Les 50 films les plus diffusés depuis 1950 montrent une hégémonie des comédies populaires françaises (ex: Le Capitan, La Grande Vadrouille).
    4. Représentation des femmes par média (temps de parole en 2020) :
    - Les pires (le moins de femmes) : L'Equipe (13%), TMC (21.3%), NRJ (23.1%), RMC Story (23.6%), RMC (25.0%).
    - Les meilleurs (le plus de femmes) : Fip (70.4%), FRANCE 4 (60.0%), 6TER (48.0%), FRANCE 5 (47.2%), M6 (46.7%).
  `;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    if (!client) {
      const userMessage = { role: 'user', content: input };
      setMessages(prev => [...prev, userMessage, { 
        role: 'assistant', 
        content: "Erreur : La clé API Mistral n'a pas été détectée. Veuillez vérifier votre fichier .env et relancer le serveur de développement (npm run dev)." 
      }]);
      setInput('');
      return;
    }

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const messagesToSend = [
        { role: 'user', content: contextData }, // Provide context first
        ...messages.filter(m => m.role !== 'assistant' || m.content !== "Bonjour ! Je suis l'assistant de ce projet de Datavisualisation. Posez-moi vos questions sur les données ou le projet !"),
        userMessage
      ];

      const response = await client.chat.complete({
        model: 'mistral-small-latest',
        messages: messagesToSend,
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.choices && response.choices[0] ? response.choices[0].message.content : (response.message ? response.message.content : "Message reçu.")
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Mistral API error:", error);
      let errMsg = "Désolé, une erreur s'est produite lors de la communication avec l'agent.";
      if (error.status === 401 || (error.message && (error.message.includes('401') || error.message.toLowerCase().includes('unauthorized')))) {
        errMsg = "La clé API Mistral configurée dans le fichier .env est incorrecte ou expirée (Erreur 401 - Non autorisé). Veuillez vérifier votre clé API.";
      }
      setMessages(prev => [...prev, { role: 'assistant', content: errMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: '20px', right: '20px', 
          backgroundColor: 'white', color: '#4E79A7',
          width: '60px', height: '60px', borderRadius: '50%',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          cursor: 'pointer', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          fontSize: '24px', border: '2px solid #4E79A7',
          overflow: 'hidden', padding: isOpen ? '0' : '6px'
        }}
      >
        {isOpen ? (
          <i className="fas fa-times" style={{ color: '#4E79A7' }}></i>
        ) : (
          <i className="fas fa-comments" style={{ color: '#4E79A7' }}></i>
        )}
      </div>

      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '20px',
          width: '350px', height: '450px',
          backgroundColor: '#fff', borderRadius: '12px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', zIndex: 1000,
          overflow: 'hidden', fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{
            backgroundColor: '#4E79A7', color: 'white', padding: '15px',
            fontWeight: '600', fontSize: '16px'
          }}>
            Assistant IA - Dataviz
          </div>

          <div style={{
            flex: 1, padding: '15px', overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: '10px',
            backgroundColor: '#f8f9fa'
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.role === 'user' ? '#4E79A7' : '#e9ecef',
                color: msg.role === 'user' ? 'white' : '#333',
                padding: '10px 15px', borderRadius: '15px',
                maxWidth: '85%', fontSize: '14px', lineHeight: '1.4'
              }}>
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', color: '#666', fontSize: '12px', fontStyle: 'italic' }}>
                L'IA réfléchit...
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} style={{
            display: 'flex', padding: '10px', borderTop: '1px solid #eee',
            backgroundColor: 'white'
          }}>
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question..."
              style={{
                flex: 1, padding: '10px', border: '1px solid #ddd',
                borderRadius: '20px', outline: 'none', fontSize: '14px'
              }}
            />
            <button type="submit" disabled={isLoading || !input.trim()} style={{
              background: 'none', border: 'none', color: '#4E79A7',
              padding: '0 15px', cursor: 'pointer', fontSize: '18px'
            }}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
