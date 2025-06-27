export const injectUmamiScript = () => {
  const script = document.createElement('script');
  script.defer = true;
  script.src = 'https://cloud.umami.is/script.js';
  script.setAttribute('data-website-id', import.meta.env.VITE_UMAMI_PROJECT_ID);
  document.head.appendChild(script);
};
