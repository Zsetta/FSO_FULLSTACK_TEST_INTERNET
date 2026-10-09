import { useState,useEffect } from 'react'
import axios from 'axios'
import conection from '../services/conection.js'

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [finder,setFinder] = useState('');
  const [change,setChange] = useState(0);

  useEffect(()=>{
    console.log("get")
    conection
      .getAll()
      .then(response=>{setPersons(response);console.log(response)});
  },[change]);

  const handleClick = (e) => {
    console.log(persons);
    e.preventDefault();
    const encontrado = persons.find(person=>person.name.toLowerCase() === newName.toLowerCase());
    
    if(encontrado !== undefined && encontrado.number !== newPhone)
    {
      const seguro = confirm("La persona existe, quiere cambiar el numero de telefono?");
      if(seguro)
      {
        const newPerson = {...encontrado,number:newPhone};
        console.log(newPerson);
        conection
          .changePhone(newPerson,encontrado.id)
          .then(res=>{
            const newPersonObj = persons.map(person=>person.id !==encontrado.id ? person : res );
            console.log(newPersonObj);
            setPersons(newPersonObj);
            setNewName('');
            setNewPhone('');
            setFinder('');
          })
          .catch(err=>{
            alert("La persona se encuentra eliminada del servidor");
            setChange(change=>change+1);
          })
      }
      else
      {
        setNewName('');
          setNewPhone('');
          setFinder('');
      }
    }
    else if(encontrado === undefined)
    {
      const newPerson = {name:newName,number:newPhone};
      
      conection
        .create(newPerson)
        .then(response => {
          console.log(response)
          const newPersonObj = [...persons,response];
          console.log(newPersonObj);
          setPersons(newPersonObj);
          setNewName('');
          setNewPhone('');
          setFinder('');
      })
    }
    else
    {
      alert("La persona existe");
    }
  };

  const handleNoteChangeName = (e) => {
    setNewName(e.target.value);
  };
  const handleNoteChangePhone = (e) => {
    setNewPhone(e.target.value);
  };

  const handleFinder = (e) => {
    setFinder(e.target.value);
    const result = persons.filter(p=>p.name.toLowerCase().includes(e.target.value.toLowerCase()));
  };

  const deletePerson = (id) => {
    conection
      .deleteObject(id)
      .then(res=>{
        console.log(res.id);
        const newPersonObj = persons.filter(person=>person.id !== res.id);
        console.log(newPersonObj);
        setPersons(newPersonObj)
        setChange(change=>change+1);
      });
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter: <input value={finder} onChange={handleFinder}/>
      </div>
      <h2>Add new</h2>
      <form>
        <div>
          name: <input value={newName} onChange={handleNoteChangeName} />
        </div>
        <div>
          number: <input value={newPhone} onChange={handleNoteChangePhone} />
        </div>
        <div>debug: {newName}</div>
        <div>
          <button onClick={handleClick} type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {finder.length > 0 
        ? 
        (
          persons.filter(p=>p.name.toLowerCase().includes(finder.toLowerCase())).map(person=><div className="personas" key={Math.random()}><p>{person.name} {person.number}</p><button onClick={()=>{deletePerson(person.id)}} type="submit">delete</button></div>)
        )
        :
        (
          persons.map(person=><div className="personas" key={Math.random()}><p>{person.name} {person.number}</p><button onClick={()=>{deletePerson(person.id)}} type="submit">delete</button></div>)
        )
      }
    </div>
  );
};

export default App