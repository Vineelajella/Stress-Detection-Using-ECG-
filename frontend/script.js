document.getElementById('uploadForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(this);
    const personIndex = document.getElementById('personIndex').value;

    // Add personIndex to the formData
    formData.append('personIndex', personIndex);

    try {
        const response = await fetch('http://localhost:3000/api/predict', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById('result').innerText = `Prediction: ${result.result}`;
        } else {
            document.getElementById('result').innerText = `Error: ${result.error}`;
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('result').innerText = `Error: ${error.message}`;
    }
});
