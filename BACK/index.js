const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
morgan('tiny')
app.use(express.json());
app.use(cors());
let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": "1"
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": "2"
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": "3"
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": "4"
    }
];

const informacion = () => {
	const fecha = new Date();
	return `
		<h2>Server has info for ${persons.length} persons</h2>
		<br/>
		<p>${fecha}</p>
	`
}

const mor = morgan((tokens, req, res)=>{
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
})

app.use(mor)

app.get('/api/persons',(req,res)=>{
	res.json(persons);
});

app.get('/api/info',(req,res)=>{
	res.send(informacion());
});

app.get('/api/persons/:id',(req,res)=>{
	const id = Number(req.params.id);
	const note = persons.find(person=>Number(person.id) === id);
	console.log(note);
	if(note)
	{
		res.json(note)
	}
	else
	{
		res.status(404).end()
	}
});

app.delete('/api/persons/:id',(req,res)=>{
	const id = Number(req.params.id);
	console.log("eliminando...")
	persons = persons.filter(person=>Number(person.id) !== id);
	res.status(204).end();
});

app.post('/api/persons',(req,res)=>{
	const body = req.body;
	console.log(body);
	if(!body.name || !body.number)
	{
		return res.status(400).json({error:'content-missing'})
	}
	const repetido = persons.find(person=>person.name === body.name);
	if(repetido)
	{
		return res.status(400).json({error:'Name must be unique'})
	}
	const person = {
		name:body.name,
		number:body.number,
		id:`${persons.length > 0 ?Math.max(...persons.map(person=>Number(person.id)))+1 : 1}`
	}
	console.log(person)
	persons.push(person);
	console.log(persons)
	res.json(person)
})

app.put('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'content-missing' });
    }

    const person = persons.find(p => Number(p.id) === id);

    if (!person) {
        return res.status(404).json({ error: 'person not found' });
    }

    const updatedPerson = {
        ...person,
        name: body.name,
        number: body.number
    };

    persons = persons.map(p =>
        Number(p.id) === id ? updatedPerson : p
    );

    res.json(updatedPerson);
});

//se ejecuta si el resto (anteriores) no se ejecuta
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001 || process.env.PORT;

app.listen(PORT,()=>{
	console.log(`Server on port: ${PORT}`);
});