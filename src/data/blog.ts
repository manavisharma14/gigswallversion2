export type Blog = {
    id: string;
    title: string;
    coverImg: string;
    content: string;
    authorName: string;
    authorImage: string;
    createdAt: string;
  };
  
  export const blogs: Blog[] = [
    {
      id: "manavi-story",
      title: "Still Learning. Still Building.",
      coverImg: "/assets/blog1.png",
      content: `I’m Manavi Sharma, and I grew up in Gurgaon. As a kid, I wasn’t the most curious person — more of a daydreamer...`,
      authorName: "Manavi Sharma",
      authorImage: "/assets/manavi1.png",
      createdAt: "2025-09-10",
    },
    {
      id: "top-freelancing-skills",
      title: "Top 10 Freelancing Skills Every Student Should Learn in 2025",
      coverImg: "/assets/blog2.jpeg",
      content: `The freelancing economy is booming, and college students are uniquely positioned...`,
      authorName: "Shrishti",
      authorImage: "/assets/shrishti.png",
      createdAt: "2025-09-10",
    },
  ];