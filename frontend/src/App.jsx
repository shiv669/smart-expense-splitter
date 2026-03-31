import { useEffect, useState } from 'react'

function App() {

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

    async function fetchGroups() {
        try {
            const res = await fetch('http://localhost:5000/api/groups')
            const data = await res.json()

            setGroups(data)
        }
        catch (err) {
            console.log(err)
        }
    }

    async function createGroup() {
        if (!groupName) {
            alert('enter group name')
            return
        }

        try {
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
        catch (err) {
            console.log(err)
        }
    }

    async function fetchUsers(groupId) {
        try {
            const res = await fetch(`http://localhost:5000/api/users/${groupId}`)
            const data = await res.json()

            setUsers(data)
        }
        catch (err) {
            console.log(err)
        }
    }

    async function addUser() {
        if (!userName || !selectedGroup) {
            alert('enter user name or select group')
            return
        }

        try {
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
        catch (err) {
            console.log(err)
        }
    }

    async function selectGroup(group) {
        setSelectedGroup(group)
        await fetchUsers(group.id)
        await fetchBalances(group.id)
    }

    useEffect(() => {
        fetchGroups()
    }, [])

    async function addExpense() {
        if (!amount || !selectedGroup || !payerId) {
            alert('fill all fields')
            return
        }

        try {
            await fetch('http://localhost:5000/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    group_id: selectedGroup.id,
                    payer_id: payerId,
                    amount: parseFloat(amount),
                    description: description,
                    category: category
                })
            })
            await fetchBalances(selectedGroup.id)

            setAmount('')
            setDescription('')
            setCategory('')
        }
        catch (err) {
            console.log(err)
        }
    }

    async function fetchBalances(groupId) {
        try {
            const res = await fetch(`http://localhost:5000/api/balances/${groupId}`)
            const data = await res.json()

            setBalances(data)
        }
        catch (err) {
            console.log(err)
        }
    }

    async function fetchCategory(desc) {
        if (!desc) {
            setCategory('')
            return
        }
        try {
            const res = await fetch('http://localhost:5000/api/ai/categorize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ description: desc })
            })

            const data = await res.json()
            setCategory(data.category)
        }
        catch (err) {
            setCategory('Other')
        }
    }

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

                    <h3>Add Expense</h3>

                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="amount"
                    />

                    <input
                        type="text"
                        value={description}
                        onChange={(e) => {
                            const val = e.target.value
                            setDescription(val)
                            fetchCategory(val)
                        }}
                        placeholder="description"
                    />

                    <div>
                        Category: {category}
                    </div>

                    <select
                        value={payerId}
                        onChange={(e) => setPayerId(e.target.value)}
                    >
                        <option value="">select payer</option>
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.name}
                            </option>
                        ))}
                    </select>

                    <button onClick={addExpense}>
                        add expense
                    </button>

                    <h3>Balances</h3>

                    {Object.keys(balances).map((id) => (
                        <div key={id}>
                            User {id}: {balances[id]}
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default App