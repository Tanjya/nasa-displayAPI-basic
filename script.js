// const API_KEY = 'sKFtJEmy8JWNkrSD5jPeiiRldbcMzVzpwyyTuixc'; // Your NASA API Key
// const APOD_BASE_URL = 'https://api.nasa.gov/planetary/apod';

document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'sKFtJEmy8JWNkrSD5jPeiiRldbcMzVzpwyyTuixc'; // Your NASA API Key
    const APOD_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

    const apodTitle = document.getElementById('apod-title');
    const apodDate = document.getElementById('apod-date');
    const apodImage = document.getElementById('apod-image');
    const apodVideo = document.getElementById('apod-video');
    const apodDescription = document.getElementById('apod-description');
    const mediaContainer = document.querySelector('.media-container');

    // Function to fetch and display APOD data
    async function fetchAPOD() {
        try {
            const response = await fetch(APOD_URL);
            if (!response.ok) {
                // Check if the response was successful
                const errorData = await response.json();
                throw new Error(errorData.msg || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Display Title and Date
            apodTitle.textContent = data.title;
            apodDate.textContent = data.date;

            // Handle Media (Image or Video)
            if (data.media_type === 'image') {
                apodImage.src = data.url;
                apodImage.style.display = 'block'; // Show image
                apodVideo.style.display = 'none';  // Hide video
                mediaContainer.style.paddingBottom = '0'; // Adjust for image aspect ratio
                apodImage.style.objectFit = 'contain'; // Ensure full image fits
                apodImage.onload = () => {
                    // Reset padding-bottom to 0 if the image is loaded and displayed to avoid extra space
                    // or calculate dynamic aspect ratio here if needed for taller images.
                    mediaContainer.style.height = `${apodImage.clientHeight}px`;
                };
            } else if (data.media_type === 'video') {
                // For YouTube videos, convert watch URL to embed URL
                const embedUrl = data.url.replace("watch?v=", "embed/");
                apodVideo.src = embedUrl;
                apodVideo.style.display = 'block'; // Show video
                apodImage.style.display = 'none';  // Hide image
                mediaContainer.style.paddingBottom = '56.25%'; // 16:9 aspect ratio for video
                mediaContainer.style.height = 'auto'; // Let padding control height
            } else {
                // Fallback for unsupported media types or errors
                apodImage.style.display = 'none';
                apodVideo.style.display = 'none';
                mediaContainer.style.paddingBottom = '0';
                apodDescription.textContent = 'Media type not supported or failed to load.';
                console.warn('Unsupported media type:', data.media_type);
            }

            // Display Description
            apodDescription.textContent = data.explanation;

        } catch (error) {
            console.error("Error fetching APOD:", error);
            apodTitle.textContent = 'Failed to load APOD';
            apodDate.textContent = '';
            apodDescription.textContent = 'Please check your API key or try again later.';
            apodImage.style.display = 'none';
            apodVideo.style.display = 'none';
            mediaContainer.style.paddingBottom = '0'; // Clear media container if error
            mediaContainer.style.height = 'auto';
        }
    }

    // Call the function when the page loads
    fetchAPOD();
});