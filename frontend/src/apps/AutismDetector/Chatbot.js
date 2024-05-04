import React, { useState } from 'react';
import PropTypes from 'prop-types';

function Chatbot({ onClose }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedSubOption, setSelectedSubOption] = useState(null);
  const [previousOptions, setPreviousOptions] = useState([]); // Track previous options

  const handleOptionClick = (option) => {
    setPreviousOptions([...previousOptions, selectedOption]); // Store the previous selected option
    setSelectedOption(option);
    setSelectedSubOption(null);

    // Check if the selected option is the specific subquestion
    if (option === 'At what age do early signs of autism typically appear?') {
      // Display the specific message for this subquestion
      setSelectedSubOption(' Early signs of autism typically appear in children around the age of 2 or earlier. However, its important to note that the exact age at which these signs become noticeable can vary from child to child.');
    } else if (option === 'What social communication difficulties should I look out for?') {
      // Display the specific message for this subquestion
      setSelectedSubOption('Social communication difficulties are a hallmark feature of autism spectrum disorder (ASD). When looking out for social communication difficulties in individuals, especially children, you may observe several key signs and challenges.');
    } else if (option === 'Are repetitive Behaviours an early sign of autism?') {
      // Display the specific message for this subquestion
      setSelectedSubOption('Yes, repetitive Behaviours can be an early sign of autism spectrum disorder (ASD). These repetitive Behaviours are often referred to as "stereotyped" or "restricted" Behaviours. While they can manifest differently in each individual, some common examples include hand-flapping, rocking, repeating certain words or phrases (echolalia), and an insistence on sameness or routines.');
    } else if (option === 'How do sensory sensitivities manifest in young children with autism?') {
      // Display the specific message for this subquestion
      setSelectedSubOption('Sensory sensitivities refer to atypical reactions or responses to sensory stimuli such as lights, sounds, textures, tastes, and smells. These sensitivities can affect how children perceive and interact with their environment. Here are some common ways sensory sensitivities may manifest in young children with autism: Hypersensitivity (Over-Responsiveness), Auditory Hypersensitivity, etc.');
    } else if (option === 'What professionals are involved in the diagnosis of autism?') {
      // Display the specific message for this subquestion
      setSelectedSubOption('The diagnosis of autism typically involves a multidisciplinary team of professionals who work together to assess and evaluate developmental and Behavioural characteristics: Pediatrician or Family Doctor, Child Psychologist or Developmental Psychologist, etc');
    } else if (option === 'What criteria are used for diagnosing autism?') {
      // Display the specific message for this subquestion
      setSelectedSubOption('The specific criteria used for diagnosing autism may vary slightly based on the diagnostic criteria adopted, but the most commonly used criteria are from the Diagnostic and Statistical Manual of Mental Disorders, Fifth Edition (DSM-5) and the International Classification of Diseases, Tenth Revision (ICD-10 or ICD-11, depending on the region).');
    } else if (option === 'What is Applied Behaviour Analysis (ABA) therapy?') {
      // Display the specific message for this subquestion
      setSelectedSubOption('Applied Behaviour Analysis (ABA) therapy is a structured and evidence-based approach to understanding and modifying Behaviour, with a primary focus on improving socially significant Behaviours. It is widely used as an effective intervention for individuals with autism spectrum disorder (ASD) and other developmental or Behavioural disorders.');
    } else if (option === 'Are there alternative therapies to ABA?') {
      // Display the specific message for this subquestion
      setSelectedSubOption('Yes, there are alternative therapies and interventions for individuals: Speech Therapy, Occupational Therapy, Physical Therapy, Social Skills Training, Cognitive Behavioural Therapy (CBT), Developmental Therapies: Developmental therapies, etc');
    } else if (option === 'How can speech therapy benefit children with autism?') {
      // Display the specific message for this subquestion
      setSelectedSubOption('Speech therapy, also known as speech-language therapy, can benefit children with autism in several ways: Improving Communication Skills, Enhancing Articulation, Expanding Vocabulary, Addressing Pragmatic Language, etc');
    } else if (option === 'What strategies can help with communication and social interactions?') {
      // Display the specific message for this subquestion
      setSelectedSubOption('Strategies to support communication and social interactions in individuals with autism may include: Visual Supports, Structured Social Skills Training, Use of Visual Aids: Visual aids, like PECS (Picture Exchange Communication System), can facilitate communication.');
    } else if (option === 'Are there support groups for families affected by autism?') {
      // Display the specific message for this subquestion
      setSelectedSubOption('Yes, there are several support groups and organizations in the United Kingdom that provide assistance and resources for families affected by autism. Please look at the Helpline numbers on the application for help.');
    } else if (option === 'What resources are available for educational support?') {
      // Display the specific message for this subquestion
      setSelectedSubOption('Educational support for children with autism can include special education services, Individualized Education Plans (IEPs), and a range of educational strategies and tools are used.');
    } else if (option === 'How can I create an autism-friendly environment at home or in the community?') {
      // Display the specific message for this subquestion
      setSelectedSubOption('Creating an autism-friendly environment involves making spaces and interactions more accessible and comfortable for individuals with autism. Here are some tips: Sensory Considerations: Be mindful of sensory sensitivities. Provide sensory-friendly spaces with options for sensory regulation, like quiet areas or sensory-friendly toys. Visual Supports: Use visual schedules, cues, or social stories to help individuals with autism understand routines and expectations.');
    }
  };

  const handleBackClick = () => {
    const previousOption = previousOptions.pop(); // Get the previous option
    setSelectedOption(previousOption);
    setSelectedSubOption(null);
    setPreviousOptions([...previousOptions]); // Update the list of previous options
  };

  let content;
  if (selectedSubOption) {
    // Display messages for selected sub-options

    content = (
      <div style={{ border: '3px solid #ccc', padding: '10px', marginBottom: '10px' }}>
        <p style={{ color: 'blue' }}>
          {selectedOption}
        </p>
      </div>
    );
  } else if (selectedOption) {
    content = (
      <div style={{ border: '3px solid #ccc', padding: '10px', marginBottom: '10px' }}>
        <p style={{ color: 'blue' }}>
          {selectedOption}
        </p>
      </div>
    );
  } else {
    content = <p>Hello, How can I help you?</p>;
  }

  let subContent;
  if (selectedSubOption) {
    subContent = (
      <div style={{ border: '3px solid #ccc', padding: '10px', marginBottom: '10px' }}>
        <p style={{ color: 'green' }}>
          {selectedSubOption}
        </p>
      </div>
    );
  }

  let buttons;
  if (selectedSubOption) {
    buttons = null; // No further options when a sub-option is selected
  } else if (selectedOption) {
    let subQuestions;
    if (selectedOption === 'What are the common early signs of autism?') {
      subQuestions = [
        'At what age do early signs of autism typically appear?',
        'What social communication difficulties should I look out for?',
        'Are repetitive Behaviours an early sign of autism?',
        'How do sensory sensitivities manifest in young children with autism?',
      ];
    } else if (selectedOption === 'How is autism diagnosed?') {
      subQuestions = [
        'What professionals are involved in the diagnosis of autism?',
        'What criteria are used for diagnosing autism?',
      ];
    } else if (selectedOption === 'What are the available treatments and therapies for individuals with autism?') {
      subQuestions = [
        'What is Applied Behaviour Analysis (ABA) therapy?',
        'Are there alternative therapies to ABA?',
        'How can speech therapy benefit children with autism?',
      ];
    } else {
      subQuestions = [
        'What strategies can help with communication and social interactions?',
        'Are there support groups for families affected by autism?',
        'What resources are available for educational support?',
        'How can I create an autism-friendly environment at home or in the community?',
      ];
    }

    buttons = subQuestions.map((option) => (
      <button
        key={option}
        onClick={() => handleOptionClick(option)}
        type="button" // Add the 'type' attribute to the button
        style={{
          display: 'block',
          width: '100%',
          padding: '10px',
          margin: '5px 0',
          backgroundColor: '#C68B77',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        {option}
      </button>
    ));
  } else {
    const questions = [
      'What are the common early signs of autism?',
      'How is autism diagnosed?',
      'What are the available treatments and therapies for individuals with autism?',
      'How can I support a child or family member with autism?',
    ];

    buttons = questions.map((option) => (
      <button
        key={option}
        onClick={() => handleOptionClick(option)}
        type="button" // Add the 'type' attribute to the button
        style={{
          display: 'block',
          width: '100%',
          padding: '10px',
          margin: '5px 0',
          backgroundColor: '#C68B77',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        {option}
      </button>
    ));
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '300px',
        height: '500px',
        backgroundColor: '#f0f0f0',
        border: '7px solid #C68B77',
        borderRadius: '8px',
        padding: '10px',
        zIndex: 1000,
        overflow: 'auto',
      }}
    >
      <div style={{ position: 'relative' }}>
        {previousOptions.length > 0 && ( // Only show the back button if there are previous options
          <button
            onClick={handleBackClick}
            style={{
              position: 'absolute',
              top: 0,
              left: 0, // Position at the top left corner
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#034d32',
              fontSize: '20px',
            }}
            type="button"
          >
            {'<-'}
          </button>
        )}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#034d32',
            fontSize: '20px',
          }}
          type="button"
        >
          X
        </button>
      </div>
      <h2 style={{ margin: '10px 0', textAlign: 'center' }}>Chat</h2>
      <hr style={{ borderColor: '#034d32' }} />
      {content}
      {subContent}
      <div>{buttons}</div>
    </div>
  );
}

// Add prop validation for the 'onClose' prop
Chatbot.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Chatbot;
