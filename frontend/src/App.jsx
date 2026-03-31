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
        catch(err){
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
        fetchUsers(group.id)
        fetchBalances(group.id)
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
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Inter, system-ui, sans-serif' }}>

            <h1 style={{ fontSize: '32px', fontWeight: '800' }}>Smart Expense Splitter</h1>
            <p style={{ color: '#666' }}>Group expenses made simple</p>

            <div style={{ marginTop: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>

                <h3>Select or Create Group</h3>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                    <input
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="group name"
                        style={{ flex: 1, padding: '10px', border: '1px solid #ccc' }}
                    />

                    <button
                        onClick={createGroup}
                        disabled={!groupName}
                        style={{
                            padding: '10px',
                            background: groupName ? '#000' : '#ccc',
                            color: '#fff',
                            border: 'none'
                        }}
                    >
                        create
                    </button>
                </div>

                {groups.length === 0 && <div style={{ color: '#888' }}>no groups yet</div>}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {groups.map(g => (
                        <div
                            key={g.id}
                            onClick={() => selectGroup(g)}
                            style={{
                                padding: '6px 12px',
                                border: '1px solid #ddd',
                                cursor: 'pointer',
                                background: selectedGroup?.id === g.id ? '#000' : '#fff',
                                color: selectedGroup?.id === g.id ? '#fff' : '#000'
                            }}
                        >
                            {g.name}
                        </div>
                    ))}
                </div>

            </div>

            {selectedGroup && (
                <div>

                    <div style={{ marginTop: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>

                        <h3>Add Members</h3>

                        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                            <input
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="member name"
                                style={{ flex: 1, padding: '10px', border: '1px solid #ccc' }}
                            />

                            <button
                                onClick={addUser}
                                disabled={!userName}
                                style={{
                                    padding: '10px',
                                    background: userName ? '#000' : '#ccc',
                                    color: '#fff',
                                    border: 'none'
                                }}
                            >
                                add
                            </button>
                        </div>

                        {users.length === 0 && <div style={{ color: '#888' }}>no members yet</div>}

                        <div>
                            {users.map(u => (
                                <span key={u.id} style={{ marginRight: '10px' }}>
                                    {u.name}
                                </span>
                            ))}
                        </div>

                    </div>

                    <div style={{ marginTop: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>

                        <h3>Add Expense</h3>

                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="amount"
                            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', marginBottom: '10px' }}
                        />

                        <input
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value)
                                fetchCategory(e.target.value)
                            }}
                            placeholder="description"
                            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', marginBottom: '10px' }}
                        />

                        <div style={{ marginBottom: '10px' }}>
                            Category: <b>{category || '...'}</b>
                        </div>

                        <select
                            value={payerId}
                            onChange={(e) => setPayerId(e.target.value)}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', marginBottom: '10px' }}
                        >
                            <option value="">select payer</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>
                                    {u.name}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={addExpense}
                            disabled={!amount || !payerId}
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: amount && payerId ? '#000' : '#ccc',
                                color: '#fff',
                                border: 'none'
                            }}
                        >
                            add expense
                        </button>

                    </div>

                    <div style={{ marginTop: '30px' }}>

                        <h3>Balances</h3>

                        {Object.keys(balances).length === 0 && <div style={{ color: '#888' }}>no expenses yet</div>}

                        {Object.keys(balances).map(id => {
                            const user = users.find(u => u.id == id)
                            const val = parseFloat(balances[id])

                            return (
                                <div key={id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                                    <span>{user ? user.name : 'user'}</span>
                                    <span style={{ color: val >= 0 ? 'green' : 'red' }}>
                                        {val >= 0 ? '+' : ''}{val.toFixed(2)}
                                    </span>
                                </div>
                            )
                        })}

                    </div>

                </div>
            )}

        </div>
    )
}

export default App