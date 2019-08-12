1.Student

- id: ObjectID
- firstname: String
- lastname: String
- studentID: String
- programID : String
- email: String
- password: String
- class: [ObjectID] -> Class
- createAt: Date

  2.Class

- id: ObjectID
- classname: String
- courseID: String
- lecturer: ObjectID -> lecturer
- exercise: [ObjectID] -> exercise
- createAt: Date

  3.Exercise

- id: ObjectID
- topicName: String
- topic: String (1,2,3,4)
- question: String
- content: String
- answer: Image
- lecturer: ObjectID -> Lecturer
- timestamps

  4.Lecturer

- id: ObjectID
- firstname: String
- lastname: String
- staffID: String
- email: String
- password: String
- createAt: Date

  5.Progress

- id: ObjectID
- Student: ObjectID -> Student
- Exercise: ObjectID -> Exercise
- content: String
- timestamps