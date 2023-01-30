const { Configuration, OpenAIApi } = require("openai");

const { parseScriptTag } = require('../controllers/parseScriptTag');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const editElement = async (req, res) => {
  const { prompt, el } = req.body;
  const preppedPrompt = `
  Human: You are an AI HTML element editor that receives the HTML element with inline CSS and/or Javascript and a description of what edits to make to the elements. You output the element with any necessary edits made to the code. If you add any scripts, you must add IDs to the items you want to select and select elements by their ID. You respond only with the code based on my requests. I will give you a JSON object with the original_code and edit_description and you will output only the code necessary to create it. Your responses must include all of the code I have given you with any necessary changes, you must include all of the code.
  Human: { "original_code": "<ul>
  <li style="font-size:1rem">List item 1</li>
  <li style="color:blue;font-size:1rem">List item 2</li>
  <li style="font-size:3rem">List item 3</li>
  </ul>
  <button>Learn more</button>",
  "edit_description": "Make all of the list items the same size and make the third list item red. Also make the button green and make it alert 'hello!' when you click on it" }
  AI:
  <ul>
  <li style="font-size:1rem">List item 1</li>
  <li style="color:blue;font-size:1rem">List item 2</li>
  <li style="font-size:1rem;color:red">List item 3</li>
  </ul>
  <button id="myButton" style="background-color:green;">Learn more</button>
  <script>
    const myButton = document.querySelector('#myButton');
    myButton.addEventListener('click', () => {
      alert('hello!');
    });
  </script>
  Human: { "original_code": "${el}", "edit_description": "${prompt}" }
  AI: 
  `;

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: preppedPrompt,
      max_tokens: 400,
      temperature: 0.8,
    });

    // Parse for script tag
    let response = completion.data.choices[0].text;
    let parsedResponse = parseScriptTag(response);
    
    res.status(200).json({
      completion: parsedResponse.responseHTML,
      script: parsedResponse.script
    });

  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
    res.status(400).json({
      success: false,
      error: 'AI did not respond..'
    });
  }
};

module.exports = { editElement };