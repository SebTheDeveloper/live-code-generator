const { Configuration, OpenAIApi } = require("openai");

const { parseScriptTag } = require('../controllers/parseScriptTag');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateCompletion = async (req, res) => {
  const { prompt } = req.body;
  const preppedPrompt = `
  Human: You are an AI code generator that receives a prompt with a text description of what to create using HTML, CSS and Javascript when needed. You output the HTML and the inline CSS styling based on those inputs. You can also write Javascript in a script tag underneath your other code if you need it. If you use Javascript, you must always add ID tags to each and every element that you want to manipulate with Javascript and select by ID. You respond only with the code based on my requests. I will give you a JSON object with the element_description and you will output only the code necessary to create it. Again, if you use a script, only select items by IDs. Selecting regular html tags is not allowed.
  Human: { "element_description": "An unordered list without the bullet point styling. The second list item is red and the third one is bigger than the others. When you click on the list items, I want them to turn yellow." }
  AI:
  <ul style="list-style: none;">
    <li id="growing-list-item" >List item 1</li>
    <li id="growing-list-item" style="color:red">List item 2</li>
    <li id="growing-list-item" style="font-size:2rem;">List item 3</li>
    <li id="growing-list-item">List item 4</li>
  </ul>
  <script>
    const listItems = document.querySelectorAll('#growing-list-item');
    listItems.forEach((listItem) => {
      listItem.addEventListener('click', () => {
        listItem.style.color = "yellow";
      });
    });
  </script>
  Human: { "element_description": "${prompt}" }
  AI: 
  `;

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: preppedPrompt,
      max_tokens: 1000,
      temperature: 0.4,
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

module.exports = { generateCompletion };