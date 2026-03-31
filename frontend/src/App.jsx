import { useEffect, useState } from 'react'

function App(){

    const [groupName, setGroupName] = useState('')
    const [groups, setGroups] = useState([])

    const [selectedGroup, setSelectedGroup] = useState(null)

    const [userName, setUserName] = useState('')
    const [users, setUsers] = useState([])

    async function fetchGroups(){
        try{
            const res = await fetch('http://localhost:5000/api/groups')
            const data = await res.json()

            setGroups(data)
        }
        catch(err){
            console.log(err)
        }
    }

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

            await res.json()

            setGroupName('')
            await fetchGroups()
        }
        catch(err){
            console.log(err)
        }
    }

    async function fetchUsers(groupId){
        try{
            const res = await fetch(`http://localhost:5000/api/users/${groupId}`)
            const data = await res.json()

            setUsers(data)
        }
        catch(err){
            console.log(err)
        }
    }

    async function addUser(){
        if(!userName || !selectedGroup){
            alert('enter user name or select group')
            return
        }

        try{
            await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: userName,
                    group_id: selectedGroup.id
                })
            })

            setUserName('')
            await fetchUsers(selectedGroup.id)
        }
        catch(err){
            console.log(err)
        }
    }

    async function selectGroup(group){
        setSelectedGroup(group)
        await fetchUsers(group.id)
    }

    useEffect(() => {
        fetchGroups()
    }, [])

    return (
        <>
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

                <h2>Groups</h2>

                {groups.map((g) => (
                    <div 
                        key={g.id}
                        onClick={() => selectGroup(g)}
                        style={{
                            cursor: 'pointer',
                            fontWeight: selectedGroup?.id === g.id ? 'bold' : 'normal'
                        }}
                    >
                        {g.name}
                    </div>
                ))}
            </div>

            {selectedGroup && (
                <div>
                    <h2>Selected Group: {selectedGroup.name}</h2>

                    <input 
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="enter user name"
                    />

                    <button onClick={addUser}>
                        add user
                    </button>

                    <h3>Users</h3>

                    {users.map((u) => (
                        <div key={u.id}>
                            {u.name}
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default App