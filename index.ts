
// Function to generate the resume HTML
function generateResume() {
    const firstNameElement = document.getElementById('firstName') as HTMLInputElement;
    const lastNameElement = document.getElementById('lastName') as HTMLInputElement;
    const titleElement = document.getElementById('title') as HTMLInputElement;
    const descriptionElement = document.getElementById('description') as HTMLTextAreaElement;
    const locationElement = document.getElementById('location') as HTMLInputElement;
    const phoneElement = document.getElementById('phone') as HTMLInputElement;
    const emailElement = document.getElementById('email') as HTMLInputElement;
    const skillsElement = document.getElementById('skills') as HTMLInputElement;
    const educationElement = document.getElementById('education') as HTMLTextAreaElement;
    const experienceElement = document.getElementById('experience') as HTMLTextAreaElement;

    // Validate inputs
    if (
        !firstNameElement.value || !lastNameElement.value ||
        !titleElement.value || !descriptionElement.value ||
        !locationElement.value || !phoneElement.value ||
        !emailElement.value || !skillsElement.value ||
        !educationElement.value || !experienceElement.value
    ) {
        alert("Please fill in all fields before generating the resume.");
        return;
    }

    const firstName = firstNameElement.value;
    const lastName = lastNameElement.value;
    const title = titleElement.value;
    const description = descriptionElement.value;
    const location = locationElement.value;
    const phone = phoneElement.value;
    const email = emailElement.value;
    const skills = skillsElement.value.split(',').map(skill => skill.trim()).join(', ');
    const education = educationElement.value.split('\n').map(line => `<p>${line}</p>`).join('');
    const experience = experienceElement.value.split('\n').map(line => `<p>${line}</p>`).join('');

    const resumeOutput = document.getElementById('resumeOutput') as HTMLDivElement;

    resumeOutput.innerHTML = `
        <div class="container" id="containerr">
            <div class="profile" contenteditable="true">
                <h1 class="profile_name">
                    <span class="profile_name_firstName">${firstName}</span>
                    <span class="profile_name_lastName">${lastName}</span>
                </h1>
                <p class="profile_title">${title}</p>
                <p class="description profile_description">${description}</p>
            </div>
            <div class="contact">
                <h3 class="title">Contact</h3>
                <p class="description" contenteditable="true">${location}</p>
                <p class="description" contenteditable="true">${phone}</p>
                <p class="description" contenteditable="true">${email}</p>
            </div>
            <div class="skills">
                <h3 class="title">Skills</h3>
                <ul class="skills_list" contenteditable="true">
                    ${skills.split(', ').map(skill => `<li>${skill}</li>`).join('')}
                </ul>
            </div>
            <div class="education" contenteditable="true">
                <h3 class="title" contenteditable="false">Education</h3>
                ${education}
            </div>
            <div class="experience" contenteditable="true">
                <h3 class="title" contenteditable="false">Experience</h3>
                ${experience}
            </div>
        </div>
    `;
    
    // Save resume to localStorage for shareable link
    const resumeData = {
        firstName,
        lastName,
        title,
        description,
        location,
        phone,
        email,
        skills,
        education,
        experience
    };

    const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
    localStorage.setItem(username, JSON.stringify(resumeData));

    // Provide shareable link
    const shareableLink = `${window.location.origin}?user=${username}`;
    alert(`Your shareable link: ${shareableLink}`);

    // Display the shareable link in an HTML element
    const linkElement = document.getElementById('shareableLink') as HTMLParagraphElement;
    if (linkElement) {
        linkElement.innerHTML = `Shareable link: <a href="${shareableLink}" target="_blank">${shareableLink}</a>`;
    }

    // Clear input fields after resume generation
    const fields = ['firstName', 'lastName', 'title', 'description', 'location', 'phone', 'email', 'skills', 'education', 'experience'];
    fields.forEach(id => {
        const element = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement;
        if (element) {
            element.value = '';
        }
    });
}

// Function to download resume as PDF without dotted borders
declare var html2pdf: any;

function downloadPDF() {
    const resumeElement = document.getElementById('containerr');

    if (!resumeElement) return;  // Early return if resume element doesn't exist

    // Temporarily remove contenteditable attributes to avoid dotted borders
    const editableElements = resumeElement.querySelectorAll('[contenteditable="true"]');
    editableElements.forEach((element) => {
        element.removeAttribute('contenteditable');
    });

    // Download PDF using html2pdf
    html2pdf()
        .from(resumeElement)
        .save()
        .then(() => {
            // Restore contenteditable attributes after PDF download
            editableElements.forEach((element) => {
                element.setAttribute('contenteditable', 'true');
            });
        });
}

// Handle shareable link on page load
window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    
    if (username) {
        const resumeData = localStorage.getItem(username);
        if (resumeData) {
            const parsedData = JSON.parse(resumeData);
            const resumeOutput = document.getElementById('resumeOutput') as HTMLDivElement;
            resumeOutput.innerHTML = `
                <div class="container">
                    <div class="profile">
                        <h1 class="profile_name">
                            <span class="profile_name_firstName">${parsedData.firstName}</span>
                            <span class="profile_name_lastName">${parsedData.lastName}</span>
                        </h1>
                        <p class="profile_title">${parsedData.title}</p>
                        <p class="description profile_description">${parsedData.description}</p>
                    </div>
                    <div class="contact">
                        <h3 class="title">Contact</h3>
                        <p class="description">${parsedData.location}</p>
                        <p class="description">${parsedData.phone}</p>
                        <p class="description">${parsedData.email}</p>
                    </div>
                    <div class="skills">
                        <h3 class="title">Skills</h3>
                        <ul class="skills_list">
                            ${parsedData.skills.split(', ').map((skill: string) => `<li>${skill}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="education">
                        <h3 class="title">Education</h3>
                        ${parsedData.education}
                    </div>
                    <div class="experience">
                        <h3 class="title">Experience</h3>
                        ${parsedData.experience}
                    </div>
                </div>
            `;
        }
    }
};

// Ensure buttons trigger the right functions
document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generateResumeButton') as HTMLButtonElement;
    if (generateButton) {
        generateButton.addEventListener('click', generateResume);
    }

    const downloadButton = document.getElementById('downloadPDFButton') as HTMLButtonElement;
    if (downloadButton) {
        downloadButton.addEventListener('click', downloadPDF);
    }
});
