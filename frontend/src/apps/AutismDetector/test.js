import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import autismHomeVideo from '../../images/autism-test.gif';
// https://giphy.com/stickers/kawaii-ai-aiandaiko-u08kIXMTUDGCx7tz6p

function TestComponent() {
  const autismHomeVideoStyle = {
    width: '15%',
    height: '300px',
    float: 'left',
    marginTop: '-28vh',
    marginLeft: '55%',
    position: 'relative',
    display: 'block',
    objectFit: 'cover',
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '90vh',
    backgroundColor: '#F5D0AF',
  };

  const contentContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '800px',
    height: '65%',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'column',
    marginBottom: '20px',
  };

  const buttonBoxStyle = {
    backgroundColor: '#C68B77',
    padding: '15px 30px',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  };

  const linkStyle = {
    display: 'inline-block',
    backgroundColor: '#C68B77',
    padding: '15px 30px',
    borderRadius: '15px',
    border: '2px solid white',
    color: 'white',
    fontSize: '18px',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  };

  const descriptionStyle = {
    backgroundColor: '#e0e0e0',
    padding: '10px',
    borderRadius: '5px',
    color: '#C68B77',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: '10px',
  };

  const goBackButtonStyle = {
    backgroundColor: '#f0f0f0',
    color: '#C68B77',
    padding: '10px 15px',
    marginTop: '-150px',
    marginLeft: '-90%',
    borderRadius: '5px',
    border: '2px solid #C68B77',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  // React Router v6 uses useNavigate hook
  const navigate = useNavigate();

  // Define handleGoBack to navigate back
  const handleGoBack = () => navigate(-1);

  return (
    <div style={containerStyle}>
      <button type="button" style={goBackButtonStyle} onClick={handleGoBack}>&larr; Go Back</button>
      <div style={contentContainerStyle}>
        <div style={buttonContainerStyle}>
          {/* Use Link as the button itself */}
          <div style={buttonBoxStyle}>
            <Link to="/autism_instructions/questionnairetype" style={linkStyle}>
              Go to Questionnaire
            </Link>
            <p style={descriptionStyle}>
              This questionnaire is designed to explore various aspects of social
              communication and behavior in alignment with the Diagnostic and Statistical Manual of Mental Disorders,
              Fifth Edition (DSM-5) criteria for Autism Spectrum Disorder (ASD).
              The DSM-5 emphasizes two core areas for diagnosis: deficits in social communication and social interaction across multiple contexts,
              and restricted, repetitive patterns of behavior, interests, or activities.
              Each question encourages self-reflection on aspects of social communication,
              relationships, and behavioral patterns that individuals may find challenging.
              The questionnaire will take 15-20 minutes depending on the user.
            </p>
          </div>
          <div style={buttonBoxStyle}>
            <Link to="/autism_instructions/game" style={linkStyle}>
              Go to Game
            </Link>
            <p style={descriptionStyle}>
              The &quot;Social Interaction Challenge&quot; game is an educational tool designed to help individuals,
              particularly those with autism, improve their understanding and management of social interactions and sensory experiences.
              Through a series of scenarios, players are presented with various social and sensory situations that require thoughtful
              responses or actions.
              The game aims to enhance social communication skills, emotional recognition, and adaptability in changing environments,
              which are areas often challenging for individuals on the autism spectrum.
            </p>
          </div>
        </div>
      </div>
      <div style={autismHomeVideoStyle} className="video-container">
        <img src={autismHomeVideo} alt="Autism Home" style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}

export default TestComponent;
