# Sheng API README

## Overview

Welcome to the Sheng API! This API serves as the backend for the Sheng Dictionary project, providing functionality to manage users, authentication, and soon, Sheng words. This README provides an overview of the current routes and their purposes. Please note that this documentation is a work in progress as the project evolves.

## Users Route

### 1. Generate Collaborator Token

#### Route
```
POST /users/generate/collabtoken
```

#### Purpose
Generates a token for authenticating as a collaborator to access the database.

### 2. Generate Registration Token (Admin Only)

#### Route
```
POST /users/generate/regtoken
```

#### Purpose
Admin-only route to create a special JWT token. This token is used in a special link provided to potential collaborators, allowing them to create a contributor user account.

### 3. Register User

#### Route
```
POST /users/register
```

#### Purpose
Used by potential contributors to create a user account. Requires a valid registration token generated by the admin.

### 4. Update User Details

#### Route
```
PUT /users/update
```

#### Purpose
Used by contributors to update their user details, such as username, password, etc.

## Word Route (Work in Progress)

The Word Route is currently under development. Once completed, it will provide functionality to retrieve Sheng words from the database.

## Getting Started

1. Clone the repository.

```bash
git clone https://github.com/your-username/sheng-api.git
cd sheng-api
```

2. Install dependencies.

```bash
npm install
```

3. Set up your environment variables.

   - Create a `.env` file in the root directory.
   - Define the necessary environment variables, such as database connection details and secret keys.

4. Run the API.

```bash
npm start
```

The API will be accessible at `http://localhost:4000` by default.

## Contributing

Contributions to the Sheng API are welcome! Feel free to submit issues or pull requests. If you have ideas for new features or improvements, please share them with the community.

## Special Thanks

Special thanks to Derrick Mbarani [@Sciederrick](https://github.com/Sciederrick) for the inspiration from his Sheng API. Your work has been a valuable reference and inspiration for this project!

Thank you for contributing to the Sheng Dictionary project! 🚀