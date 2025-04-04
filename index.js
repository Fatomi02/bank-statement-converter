document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("bankStatement");
  const fileNameDisplay = document.getElementById("fileName");
  const uploadForm = document.getElementById("uploadForm");
  const submitBtn = document.getElementById("submitBtn");
  const jsonOutput = document.getElementById("jsonOutput");

  // File name display
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    fileNameDisplay.textContent = file ? file.name : "";
  });

  // Form submission
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate file selection
    if (!fileInput.files.length) {
      alert("Please select a file");
      return;
    }

    // Disable submit button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                Uploading...
            </div>
        `;

    // Create FormData
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
      // Simulated API call (replace with actual endpoint)
      const response = await simulateFetch(formData);

      // Display JSON response
      jsonOutput.value = JSON.stringify(response, null, 2);
    } catch (error) {
      // Handle errors
      jsonOutput.value = `Error: ${error.message}`;
    } finally {
      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = "Submit";
    }
  });

  // Simulated fetch function (replace with actual fetch)
  async function simulateFetch(
    formData,
    apiUrl = "https://bank-statement-json.onrender.com/upload"
  ) {
    try {
      // Validate API URL
      if (!apiUrl || typeof apiUrl !== "string") {
        throw new Error("Valid API URL is required");
      }

      // Perform fetch request
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
        // Optional: Include headers if needed
        // headers: {
        //     'Authorization': 'Bearer YOUR_TOKEN_HERE'
        // }
      });

      // Check if response is successful
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      // Parse JSON response
      const jsonResponse = await response.json();

      return {
        status: "success",
        data: jsonResponse,
        fileName: formData.get("file").name,
        uploadTimestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  }
});
