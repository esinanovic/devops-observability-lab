import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// On simule "fetch" pour éviter les erreurs de réseau dans le test
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      message: "API Root OK",
      status: "success",
      data: { database: { connected: true } }
    }),
  })
);

test('affiche le titre du dashboard', async () => {
  render(<App />);
  
  // On attend que l'élément soit présent (car fetch est asynchrone)
  const titleElement = screen.getByText(/Railway Full-Stack Monitor/i);
  expect(titleElement).toBeInTheDocument();
});