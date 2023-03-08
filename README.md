<h1>FumCLI</h1>
<p>FumCLI is a Command Line Interface (CLI) tool that generates boilerplate code for a Node.js and React project. With FumCLI, developers can easily create a starter Express server, CRUD operations for an entity, and generate the necessary files and folders for a full-stack web application.</p>
<h2>Installation</h2>
<p>To use FumCLI, you must have Node.js installed. Once Node.js is installed, you can install FumCLI globally using npm:</p>
<pre><code>npm install -g fumcli</code></pre>
<h2>Usage</h2>
<p>FumCLI provides several commands that generate different types of boilerplate code.</p>
<h3>Create a starter Express server</h3>
<p>To create a starter Express server, use the -s or --starter flag:</p>
<pre><code>fumcli -s</code></pre>
<p>This command generates the following files and directories:</p>
<pre><code>- config.env
- app.js
- server.js
- controllers/factoryHandler.js
- controllers/errorController.js
- utils/appError.js
- utils/apiFeatures.js
- utils/catchAsync.js
- routes/
- models/
- img/
</code></pre>
<h3>Generate CRUD operations for an entity</h3>
<p>To generate CRUD operations for an entity, use the gen-crud command:</p>
<pre><code>fumcli gen-crud -n &lt;entity_name&gt; -a &lt;attributes&gt;</code></pre>
<p>The -n or --name option specifies the name of the entity. The -a or --attributes option specifies the attributes of the entity in the format of name:type,name:type,....</p>
<p>The following additional options are also available:</p>
<ul>
  <li>-m or --models: Generate models for the entity</li>
  <li>-c or --controller: Generate a controller for the entity</li>
  <li>-r or --routes: Create routes folder</li>
</ul>
<h3>Display help information</h3>
<p>To display help information, use the -h or --help option:</p>
<pre><code>fumcli -h</code></pre>
<h2>License</h2>
<p>This project is licensed under the MIT License - see the LICENSE.md file for details.</p>
