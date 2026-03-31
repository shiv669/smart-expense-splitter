import { useEffect, useState } from 'react'

function App(){

    const [groupName, setGroupName] = useState('')
    const [groups, setGroups] = useState([])
    const [selectedGroup, setSelectedGroup] = useState(null)

    const [userName, setUserName] = useState('')
    const [users, setUsers] = useState([])

    const [amount, setAmount] = useState('')
    const [description, setDescription] = useState('')
    const [payerId, setPayerId] = useState('')

    const [balances, setBalances] = useState({})
    const [category, setCategory] = useState('')

    async function fetchGroups(){
        const res = await fetch('http://localhost:5000/api/groups')
        const data = await res.json()
        setGroups(data)
    }

    async function fetchUsers(groupId){
        const res = await fetch(`http://localhost:5000/api/users/${groupId}`)
        const data = await res.json()
        setUsers(data)
    }

    async function fetchBalances(groupId){
        const res = await fetch(`http://localhost:5000/api/balances/${groupId}`)
        const data = await res.json()
        setBalances(data)
    }

    async function fetchCategory(desc){
        if(desc.length < 3){
            setCategory('')
            return
        }

        try{
            const res = await fetch('http://localhost:5000/api/ai/categorize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: desc })
            })

            const data = await res.json()
            setCategory(data.category)
        }
        catch{
            setCategory('Other')
        }
    }

    async function createGroup(){
        if(!groupName) return

        await fetch('http://localhost:5000/api/groups', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: groupName })
        })

        setGroupName('')
        fetchGroups()
    }

    async function selectGroup(group){
        setSelectedGroup(group)
        await fetchUsers(group.id)
        await fetchBalances(group.id)
    }

    async function addUser(){
        if(!userName || !selectedGroup) return

        await fetch('http://localhost:5000/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: userName,
                group_id: selectedGroup.id
            })
        })

        setUserName('')
        fetchUsers(selectedGroup.id)
    }

    async function addExpense(){
        if(!amount || !payerId || !selectedGroup) return

        await fetch('http://localhost:5000/api/expenses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                group_id: selectedGroup.id,
                payer_id: payerId,
                amount: parseFloat(amount),
                description: description,
                category: category
            })
        })

        setAmount('')
        setDescription('')
        setCategory('')
        setPayerId('')

        fetchBalances(selectedGroup.id)
    }

    useEffect(() => {
        fetchGroups()
    }, [])

    return (
        <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '30px',
            fontFamily: 'Arial'
        }}>

            <h1>Smart Expense Splitter</h1>

            <div style={{ marginBottom: '20px' }}>
                <input
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="new group"
                    style={{ padding: '8px', width: '60%' }}
                />
                <button onClick={createGroup} style={{ padding: '8px', marginLeft: '10px' }}>
                    add
                </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                {groups.map(g => (
                    <div
                        key={g.id}
                        onClick={() => selectGroup(g)}
                        style={{
                            padding: '8px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #eee',
                            background: selectedGroup?.id === g.id ? '#f0f0f0' : 'white'
                        }}
                    >
                        {g.name}
                    </div>
                ))}
            </div>

            {selectedGroup && (
                <div>

                    <h2>{selectedGroup.name}</h2>

                    <div style={{ marginBottom: '20px' }}>
                        <input
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="add member"
                            style={{ padding: '8px', width: '60%' }}
                        />
                        <button onClick={addUser} style={{ padding: '8px', marginLeft: '10px' }}>
                            add
                        </button>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        {users.map(u => (
                            <span key={u.id} style={{ marginRight: '10px' }}>
                                {u.name}
                            </span>
                        ))}
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="amount"
                            style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
                        />

                        <input
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value)
                                fetchCategory(e.target.value)
                            }}
                            placeholder="description"
                            style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
                        />

                        <div style={{ marginBottom: '10px' }}>
                            Category: <b>{category || '...'}</b>
                        </div>

                        <select
                            value={payerId}
                            onChange={(e) => setPayerId(e.target.value)}
                            style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
                        >
                            <option value="">select payer</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>
                                    {u.name}
                                </option>
                            ))}
                        </select>

                        <button onClick={addExpense} style={{ padding: '10px', width: '100%' }}>
                            add expense
                        </button>
                    </div>

                    <h3>Balances</h3>

                    {Object.keys(balances).map(id => {
                        const user = users.find(u => u.id == id)
                        const val = parseFloat(balances[id])

                        return (
                            <div key={id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid #eee',
                                padding: '8px 0'
                            }}>
                                <span>{user ? user.name : 'user'}</span>
                                <span style={{ color: val >= 0 ? 'green' : 'red' }}>
                                    {val >= 0 ? '+' : ''}{val.toFixed(2)}
                                </span>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default App