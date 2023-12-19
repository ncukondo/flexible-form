# Flexible Form

Welcome to `Flexible Form` - a dynamic form builder application built with Next.js, leveraging the power of Vercel and Vercel Postgres. This application allows users to define forms using Toml, enabling the publication and management of these forms with ease.

## Features

- **Form Definition with TOML**: Define your forms easily in TOML, making them highly configurable and easy to manage.
- **Vercel Postgres Backend**: Leverages the power of Vercel's serverless infrastructure along with a robust Postgres database.
- **Email Integration**: Integrated with SendGrid for form email functionalities.

## Live Application

Visit the live application here: [Flexible Form](https://flexible-form.vercel.app/)

## Repository

GitHub Repository: [ncukondo/flexible-form](https://github.com/ncukondo/flexible-form)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Vercel account for deployment
- Vercel Postgres and SendGrid accounts for backend services

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/ncukondo/flexible-form.git
   ```
2. Navigate to the project directory:
   ```
   cd flexible-form
   ```
3. Install NPM packages:
   ```
   npm install
   ```
4. Duplicate `.env.sample` and rename to `.env`. Fill in the necessary Vercel Postgres and SendGrid credentials.

## Usage

After setting up your `.env` file with the necessary credentials:

1. Run the development server:
   ```
   npm run dev
   ```
2. Open [http://localhost:3030](http://localhost:3030) with your browser to see the result.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

