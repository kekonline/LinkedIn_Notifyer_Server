
import { NextConfig } from 'next';
import { connectToMongo } from './app/utils/dbConfig';
// import { scrapingTask } from "./app/utils/runTasks";


const nextConfig: NextConfig = {
};

(async () => {
  await connectToMongo.connect();
  // await scrapingTask.run();
})();

export default nextConfig;
