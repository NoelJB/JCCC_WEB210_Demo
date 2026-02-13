import { ResumeServiceAbstract } from "./resume-service.mjs"

export class ResumeServiceInMemory extends ResumeServiceAbstract {
    #resumes;

    constructor() {
        super()
        this.#resumes = [
            {
                id: "njb",
                name: "Noel",
                email: "noel@workforcecenter.slu.edu",
                phone: "(555) 867-5309",
                linkedin: "http://www.linkedin.com/tommy_tutone",
                summary: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
culpa qui officia deserunt mollit anim id est laborum.`,
                skills: ["JavaScript", "HTML", "CSS", "React", "Node", "vite", "full-stack"],
                education: [
                    { start: 1973, end: 1976, school: "Ogontz", degree: null },
                    { start: 1976, end: 1979, school: "CHS", degree: "High School Diploma" },
                ],
            },
            {
                id: "bob",
                name: "Bob Smith",
                email: "bob.smith@example.com",
                phone: "(555) 867-5309",
                linkedin: "http://www.linkedin.com/robert_smith",
                summary: `Bob Smith, generic persona extraordinaire`,
                skills: ["Being Invisible", "Going unnoticed", "Eminently Replaceable"],
                education: [
                    { start: 1999, end: 2026, school: "Hard Knocks", degree: null }
                ],
            }
        ]
    }

    async getAll() {
        return this.#resumes.map(({ linkedin, summary, skills, education, ...rest }) => rest)
    }

    async getByID(id) {
        return this.#resumes.filter(resume => resume.id === id)[0];
    }
}
