// Function to generate the resume HTML
function generateResume() {
    var firstNameElement = document.getElementById('firstName');
    var lastNameElement = document.getElementById('lastName');
    var titleElement = document.getElementById('title');
    var descriptionElement = document.getElementById('description');
    var locationElement = document.getElementById('location');
    var phoneElement = document.getElementById('phone');
    var emailElement = document.getElementById('email');
    var skillsElement = document.getElementById('skills');
    var educationElement = document.getElementById('education');
    var experienceElement = document.getElementById('experience');
    // Validate inputs
    if (!firstNameElement.value || !lastNameElement.value ||
        !titleElement.value || !descriptionElement.value ||
        !locationElement.value || !phoneElement.value ||
        !emailElement.value || !skillsElement.value ||
        !educationElement.value || !experienceElement.value) {
        alert("Please fill in all fields before generating the resume.");
        return;
    }
    var firstName = firstNameElement.value;
    var lastName = lastNameElement.value;
    var title = titleElement.value;
    var description = descriptionElement.value;
    var location = locationElement.value;
    var phone = phoneElement.value;
    var email = emailElement.value;
    var skills = skillsElement.value.split(',').map(function (skill) { return skill.trim(); }).join(', ');
    var education = educationElement.value.split('\n').map(function (line) { return "<p>".concat(line, "</p>"); }).join('');
    var experience = experienceElement.value.split('\n').map(function (line) { return "<p>".concat(line, "</p>"); }).join('');
    var resumeOutput = document.getElementById('resumeOutput');
    resumeOutput.innerHTML = "\n        <div class=\"container\" id=\"containerr\">\n            <div class=\"profile\" contenteditable=\"true\">\n                <h1 class=\"profile_name\">\n                    <span class=\"profile_name_firstName\">".concat(firstName, "</span>\n                    <span class=\"profile_name_lastName\">").concat(lastName, "</span>\n                </h1>\n                <p class=\"profile_title\">").concat(title, "</p>\n                <p class=\"description profile_description\">").concat(description, "</p>\n            </div>\n            <div class=\"contact\">\n                <h3 class=\"title\">Contact</h3>\n                <p class=\"description\" contenteditable=\"true\">").concat(location, "</p>\n                <p class=\"description\" contenteditable=\"true\">").concat(phone, "</p>\n                <p class=\"description\" contenteditable=\"true\">").concat(email, "</p>\n            </div>\n            <div class=\"skills\">\n                <h3 class=\"title\">Skills</h3>\n                <ul class=\"skills_list\" contenteditable=\"true\">\n                    ").concat(skills.split(', ').map(function (skill) { return "<li>".concat(skill, "</li>"); }).join(''), "\n                </ul>\n            </div>\n            <div class=\"education\" contenteditable=\"true\">\n                <h3 class=\"title\" contenteditable=\"false\">Education</h3>\n                ").concat(education, "\n            </div>\n            <div class=\"experience\" contenteditable=\"true\">\n                <h3 class=\"title\" contenteditable=\"false\">Experience</h3>\n                ").concat(experience, "\n            </div>\n        </div>\n    ");
    // Save resume to localStorage for shareable link
    var resumeData = {
        firstName: firstName,
        lastName: lastName,
        title: title,
        description: description,
        location: location,
        phone: phone,
        email: email,
        skills: skills,
        education: education,
        experience: experience
    };
    var username = "".concat(firstName.toLowerCase(), "_").concat(lastName.toLowerCase());
    localStorage.setItem(username, JSON.stringify(resumeData));
    // Provide shareable link
    var shareableLink = "".concat(window.location.origin, "?user=").concat(username);
    alert("Your shareable link: ".concat(shareableLink));
    // Display the shareable link in an HTML element
    var linkElement = document.getElementById('shareableLink');
    if (linkElement) {
        linkElement.innerHTML = "Shareable link: <a href=\"".concat(shareableLink, "\" target=\"_blank\">").concat(shareableLink, "</a>");
    }
    // Clear input fields after resume generation
    var fields = ['firstName', 'lastName', 'title', 'description', 'location', 'phone', 'email', 'skills', 'education', 'experience'];
    fields.forEach(function (id) {
        var element = document.getElementById(id);
        if (element) {
            element.value = '';
        }
    });
}
function downloadPDF() {
    var resumeElement = document.getElementById('containerr');
    if (!resumeElement)
        return; // Early return if resume element doesn't exist
    // Temporarily remove contenteditable attributes to avoid dotted borders
    var editableElements = resumeElement.querySelectorAll('[contenteditable="true"]');
    editableElements.forEach(function (element) {
        element.removeAttribute('contenteditable');
    });
    // Download PDF using html2pdf
    html2pdf()
        .from(resumeElement)
        .save()
        .then(function () {
        // Restore contenteditable attributes after PDF download
        editableElements.forEach(function (element) {
            element.setAttribute('contenteditable', 'true');
        });
    });
}
// Handle shareable link on page load
window.onload = function () {
    var urlParams = new URLSearchParams(window.location.search);
    var username = urlParams.get('user');
    if (username) {
        var resumeData = localStorage.getItem(username);
        if (resumeData) {
            var parsedData = JSON.parse(resumeData);
            var resumeOutput = document.getElementById('resumeOutput');
            resumeOutput.innerHTML = "\n                <div class=\"container\">\n                    <div class=\"profile\">\n                        <h1 class=\"profile_name\">\n                            <span class=\"profile_name_firstName\">".concat(parsedData.firstName, "</span>\n                            <span class=\"profile_name_lastName\">").concat(parsedData.lastName, "</span>\n                        </h1>\n                        <p class=\"profile_title\">").concat(parsedData.title, "</p>\n                        <p class=\"description profile_description\">").concat(parsedData.description, "</p>\n                    </div>\n                    <div class=\"contact\">\n                        <h3 class=\"title\">Contact</h3>\n                        <p class=\"description\">").concat(parsedData.location, "</p>\n                        <p class=\"description\">").concat(parsedData.phone, "</p>\n                        <p class=\"description\">").concat(parsedData.email, "</p>\n                    </div>\n                    <div class=\"skills\">\n                        <h3 class=\"title\">Skills</h3>\n                        <ul class=\"skills_list\">\n                            ").concat(parsedData.skills.split(', ').map(function (skill) { return "<li>".concat(skill, "</li>"); }).join(''), "\n                        </ul>\n                    </div>\n                    <div class=\"education\">\n                        <h3 class=\"title\">Education</h3>\n                        ").concat(parsedData.education, "\n                    </div>\n                    <div class=\"experience\">\n                        <h3 class=\"title\">Experience</h3>\n                        ").concat(parsedData.experience, "\n                    </div>\n                </div>\n            ");
        }
    }
};
// Ensure buttons trigger the right functions
document.addEventListener('DOMContentLoaded', function () {
    var generateButton = document.getElementById('generateResumeButton');
    if (generateButton) {
        generateButton.addEventListener('click', generateResume);
    }
    var downloadButton = document.getElementById('downloadPDFButton');
    if (downloadButton) {
        downloadButton.addEventListener('click', downloadPDF);
    }
});
