import { URL, API_KEY } from './apiconfig.js';

const fetchGraphQL = async (ID) => {
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        query: `
          query GetAssignment($id: ID!) {
            getAssignment(id: $id) {
              id
              difficultyScore
              questionText
              solutionText
              hints
              answerOptions {
                id
                text
                correct
              }
              createdAt
              updatedAt
            }
          }
        `,
        variables: { id: ID }
      })
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);

    if (data.errors) {
      throw new Error(`GraphQL errors: ${data.errors.map(error => error.message).join(', ')}`);
    }

    const assignment = data.data.getAssignment;

    if (!assignment) {
      throw new Error('No assignment found with the provided ID');
    }

    // Validate the structure of the assignment object
    const requiredFields = ['id', 'difficultyScore', 'questionText', 'solutionText', 'answerOptions'];
    for (const field of requiredFields) {
      if (assignment[field] === undefined || assignment[field] === null) {
        throw new Error(`Invalid assignment data: missing field ${field}`);
      }
    }

    // Validate answerOptions
    if (!Array.isArray(assignment.answerOptions) || assignment.answerOptions.length === 0) {
      throw new Error('Invalid assignment data: answerOptions should be a non-empty array');
    }

    for (const option of assignment.answerOptions) {
      const optionFields = ['text', 'correct'];
      for (const field of optionFields) {
        if (option[field] === undefined || option[field] === null) {
          throw new Error(`Invalid answer option data: missing field ${field}`);
        }
      }
    }

    return assignment;

  } catch (error) {
    console.error('Error fetching GraphQL data:', error);
    return null; // Return null on error
  }
};

export { fetchGraphQL };
