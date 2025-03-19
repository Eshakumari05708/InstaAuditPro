document.getElementById('auditBtn').addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const spinner = document.getElementById('spinner');
    const results = document.getElementById('results');
    const actions = document.getElementById('actions');
    const chartCanvas = document.getElementById('chart');
    
    results.innerHTML = '';
    actions.classList.add('hidden');
    chartCanvas.classList.add('hidden');

    if (!username) {
        alert('Please enter a username');
        return;
    }

    spinner.classList.remove('hidden');

    const res = await fetch('http://localhost:5000/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    });
    const data = await res.json();

    spinner.classList.add('hidden');

    results.innerHTML = `
        <div class="result-card">
            <img src="${data.profilePic}" width="80">
            <h3>@${data.username}</h3>
            <p>Followers: ${data.followers}</p>
            <p>Following: ${data.following}</p>
            <p>Posts: ${data.posts}</p>
            <p>Engagement: ${data.engagementRate}</p>
        </div>
    `;
    actions.classList.remove('hidden');
    chartCanvas.classList.remove('hidden');

    // Chart.js bar chart
    new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: ['Followers', 'Following', 'Posts'],
            datasets: [{
                label: 'Profile Stats',
                data: [data.followers, data.following, data.posts],
                backgroundColor: ['#4caf50', '#2196f3', '#ff9800']
            }]
        }
    });

    // CSV Export
    document.getElementById('csvExport').onclick = () => {
        const csv = `Username,Followers,Following,Posts,Engagement\n${data.username},${data.followers},${data.following},${data.posts},${data.engagementRate}`;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${data.username}_audit.csv`;
        link.click();
    };

    // PDF Export
    document.getElementById('pdfExport').onclick = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text("InstaAudit Pro Report", 10, 10);
        doc.text(`Username: @${data.username}`, 10, 20);
        doc.text(`Followers: ${data.followers}`, 10, 30);
        doc.text(`Following: ${data.following}`, 10, 40);
        doc.text(`Posts: ${data.posts}`, 10, 50);
        doc.text(`Engagement: ${data.engagementRate}`, 10, 60);
        doc.save(`${data.username}_audit.pdf`);
    };
});
