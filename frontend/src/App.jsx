import { useState } from 'react'

function App(){

    const [groupName, setGroupName] = useState('')

    async function createGroup(){
        if(!groupName){
            alert('enter group name')
            return
        }

        try{
            const res = await fetch('http://localhost:5000/api/groups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: groupName })
            })

            const data = await res.json()
            console.log(data)

            setGroupName('')
        }
        catch(err){
            console.log(err)
        }
    }

    return (
        <div>
            <h1>Smart Expense Splitter</h1>

            <input 
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="enter group name"
            />

            <button onClick={createGroup}>
                create group
            </button>
        </div>
    )
}

export default App