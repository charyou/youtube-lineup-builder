# YouTube LineUp Builder

## Overview

YouTube LineUp Builder is a powerful web application designed to help content creators, marketers, and YouTube enthusiasts efficiently manage and analyze multiple YouTube channels. This tool allows users to input YouTube channel URLs, fetch channel data, display it in a customizable grid or list view, and save/load channel lists for easy comparison and analysis.

![YouTube LineUp Builder Screenshot](path/to/screenshot.png)

## Features

- **Channel Data Fetching**: Easily input multiple YouTube channel URLs and fetch relevant data.
- **Flexible Display**: View channels in a responsive grid or list layout.
- **Sorting and Filtering**: Sort channels by subscribers, video count, or name. Filter channels based on subscriber count.
- **Channel List Management**: Save, load, and delete custom channel lists for easy comparison and analysis.
- **Data Export**: Export channel data to CSV for further analysis in other tools.
- **Responsive Design**: Fully responsive interface that works on desktop, tablet, and mobile devices.

## Tech Stack

- **Frontend**: React with Next.js
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect, useMemo, useCallback)
- **API Handling**: Fetch API
- **Database**: Prisma ORM with SQLite (development) / PostgreSQL (production)
- **Language**: TypeScript for type safety

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/youtube-lineup-builder.git
```
Copy

2. Navigate to the project directory:
```
cd youtube-lineup-builder
```

3. Install dependencies:
```
npm install
Copyor
yarn install
```

4. Set up environment variables:
- Copy `.env.example` to `.env.local`
- Fill in the required API keys and database connection strings

5. Run database migrations:
```
npx prisma migrate dev
```

6. Start the development server:
```
npm run dev
```
or
```
yarn dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Enter YouTube channel URLs in the input form.
2. Click "Update Channels" to fetch channel data.
3. Use the sorting and filtering options to organize the channel list.
4. Save current channel lists or load previously saved lists using the Channel List Manager.
5. Export channel data to CSV for further analysis.

## Roadmap

### Short-term Goals

- Enhance error handling and user feedback
- Implement comprehensive testing (unit and integration tests)
- Improve accessibility features
- Optimize performance for large channel lists

### Mid-term Goals

- Implement user authentication and personal channel lists
- Add data visualization features (e.g., charts and graphs for channel comparisons)
- Develop channel comparison functionality
- Create a public API for integration with other tools

### Long-term Goals

- Implement machine learning for channel growth predictions and content recommendations
- Develop a mobile app version using React Native
- Create a marketplace for sharing and discovering channel lists
- Integrate with other social media platforms for cross-platform analytics

## Contributing

We welcome contributions to the YouTube LineUp Builder project! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Thanks to the YouTube Data API for making this project possible
- Shoutout to the amazing React and Next.js communities for their invaluable resources and support

## Contact

For any questions or suggestions, please open an issue on this repository or contact the maintainer at [your-email@example.com](mailto:your-email@example.com).

---

Made with ❤️ by charyou / Sebastian