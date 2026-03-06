fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test User', email: 'test5@example.com', password: 'Password123!' })
})
    .then(r => r.json())
    .then(data => console.log(JSON.stringify(data, null, 2)))
    .catch(e => console.error(e));
