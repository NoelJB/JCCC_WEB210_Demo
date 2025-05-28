# JCCC_WEB210_Demo

This is a demonstration repository for students in the JCCC [WEB-210](https://continuinged.jccc.edu/courses/detail/44810) Full-Stack Web Development Capstone course.

WEB-210 is the culmination of the [Johnson County Community College](http://www.jccc.edu) [Full Stack Web Development Certificate](https://continuinged.jccc.edu/certificates/33).  The purpose of the course is to have students pull together all the course material covered in previous classes in order to develop a fully functioning full-stack application.

Initially, this repository was conceived simply as a demonstration of the sort of full-stack CRUD application that students would be expected to deliver for the Capstone, and an example of some techniques, with students given leeway to develop their own application.  Based on early feedback, it is now intended to serve as a platform on which students can build.  At present, there is a plain HTML5/CSS/JS UI with a homegrown "nano-SPA", a (currently) partial React UI, and plans for an Angular UI in the near future.  Additional code changes will happen to make it easier to enhance the "storefront" with additional types of items.

Students will be expected to:
1. Fork the current project to their own GitHub.
2. Review the provided code with the Instructor.
3. Add a new item type, _e.g._, DVD, books, magazines, _etc_. as an instructor-led set of activities.
4. Add another item type as a student performed exercise.
5. Rebrand the webite, enhance the UI, and improve the HTML/CSS along _Mobile First_ lines.

Adding a new data type will include:
1. Defining a new model for the entity.
2. Defining a new service for the entity, including backend and frontend components.
3. Defining a API controller for the new entity.
4. Defining new pages and fragments for the new entity, or (preferably) the equivalent components for React and/or Angular.

## Running the server

The `server` directory is a standalone Node application with an embedded UI based on [EJS](https://ejs.co/).  The `react-ui` directory is a pure React application (no Vite or NextJS).  Each are independent Node projects with their own dependencies.

The server can be started by
```
JCCC_WEB210_Demo$ cd server
JCCC_WEB210_Demo/server$ npm start
```

If the server is running on port 3000, accessing `http://localhost:3000/` should bring up the EJS version of the UI.

The React UI is served directly from `react-ui/build`.  After running `npm run build` in `react-ui`, accessing `http://localhost:3000/react-ui` should bring up the React version of the UI (presuming that the server application is running on port 3000).
