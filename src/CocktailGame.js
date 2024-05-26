import React, { useState, useEffect, useRef } from 'react';
import './CocktailGame.css';

const ingredients = [
  { name: 'Vodka', image: `${process.env.PUBLIC_URL}/images/vodka.webp` },
  { name: 'Gin', image: `${process.env.PUBLIC_URL}/images/gin.webp` },
  { name: 'Rum', image: `${process.env.PUBLIC_URL}/images/rum.webp` },
  { name: 'Tequila', image: `${process.env.PUBLIC_URL}/images/tequila.webp` },
  { name: 'Triple Sec', image: `${process.env.PUBLIC_URL}/images/triple_sec.webp` },
  { name: 'Lime Juice', image: `${process.env.PUBLIC_URL}/images/lime_juice.webp` },
  { name: 'Cola', image: `${process.env.PUBLIC_URL}/images/cola.webp` },
  { name: 'Orange Juice', image: `${process.env.PUBLIC_URL}/images/orange_juice.webp` },
  { name: 'Cranberry Juice', image: `${process.env.PUBLIC_URL}/images/cranberry_juice.webp` },
  { name: 'Pineapple Juice', image: `${process.env.PUBLIC_URL}/images/pineapple_juice.webp` },
  { name: 'Grenadine', image: `${process.env.PUBLIC_URL}/images/grenadine.webp` },
  { name: 'Tonic Water', image: `${process.env.PUBLIC_URL}/images/tonic_water.webp` },
  { name: 'Soda Water', image: `${process.env.PUBLIC_URL}/images/soda_water.webp` },
  { name: 'Lemon Juice', image: `${process.env.PUBLIC_URL}/images/lemon_juice.webp` },
  { name: 'Sugar Syrup', image: `${process.env.PUBLIC_URL}/images/sugar_syrup.webp` },
  { name: 'Mint Leaves', image: `${process.env.PUBLIC_URL}/images/mint_leaves.webp` },
  { name: 'Tomato Juice', image: `${process.env.PUBLIC_URL}/images/tomato_juice.webp` },
  { name: 'Worcestershire Sauce', image: `${process.env.PUBLIC_URL}/images/worcestershire_sauce.webp` },
  { name: 'Hot Sauce', image: `${process.env.PUBLIC_URL}/images/hot_sauce.webp` },
  { name: 'Celery Salt', image: `${process.env.PUBLIC_URL}/images/celery_salt.webp` },
  { name: 'Black Pepper', image: `${process.env.PUBLIC_URL}/images/black_pepper.webp` },
  { name: 'Whiskey', image: `${process.env.PUBLIC_URL}/images/whiskey.webp` },
  { name: 'Vermouth', image: `${process.env.PUBLIC_URL}/images/vermouth.webp` },
  { name: 'Olive', image: `${process.env.PUBLIC_URL}/images/olive.webp` },
  { name: 'Angostura Bitters', image: `${process.env.PUBLIC_URL}/images/angostura_bitters.webp` }
];

const recipes = {
  Margarita: ['Tequila', 'Triple Sec', 'Lime Juice'],
  Cosmopolitan: ['Vodka', 'Triple Sec', 'Cranberry Juice'],
  Mojito: ['Rum', 'Lime Juice', 'Mint Leaves'],
  TequilaSunrise: ['Tequila', 'Orange Juice', 'Grenadine'],
  PinaColada: ['Rum', 'Pineapple Juice', 'Sugar Syrup'],
  BloodyMary: ['Vodka', 'Tomato Juice', 'Worcestershire Sauce'],
  Martini: ['Gin', 'Vermouth', 'Olive'],
  Daiquiri: ['Rum', 'Lime Juice', 'Sugar Syrup'],
  OldFashioned: ['Whiskey', 'Sugar Syrup', 'Angostura Bitters'],
  Manhattan: ['Whiskey', 'Vermouth', 'Angostura Bitters']
};

const getRandomRecipe = () => {
  const recipeNames = Object.keys(recipes);
  const randomIndex = Math.floor(Math.random() * recipeNames.length);
  return recipeNames[randomIndex];
};

const CocktailGame = () => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [message, setMessage] = useState('');
  const [currentRecipe, setCurrentRecipe] = useState('');
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [score, setScore] = useState(0);
  const soundtrackRef = useRef(null);
  const selectSoundRef = useRef(null);
  const deselectSoundRef = useRef(null);

  useEffect(() => {
    const recipeName = getRandomRecipe();
    setCurrentRecipe(recipeName);
    setRecipeIngredients(recipes[recipeName]);
  }, []);

  const startGame = () => {
    setGameStarted(true);
    if (soundtrackRef.current) {
      soundtrackRef.current.play().catch(error => {
        console.log('Autoplay was prevented:', error);
      });
    }
  };

  const handleIngredientClick = (ingredient) => {
    if (selectedIngredients.includes(ingredient.name)) {
      setSelectedIngredients(selectedIngredients.filter(item => item !== ingredient.name));
      if (deselectSoundRef.current) {
        deselectSoundRef.current.volume = 0.5; // Set volume to half
        deselectSoundRef.current.play();
      }
    } else if (selectedIngredients.length < 3) {
      setSelectedIngredients([...selectedIngredients, ingredient.name]);
      if (selectSoundRef.current) {
        selectSoundRef.current.volume = 0.5; // Set volume to half
        selectSoundRef.current.play();
      }
    }
  };

  const handleSubmit = () => {
    if (JSON.stringify(selectedIngredients.sort()) === JSON.stringify(recipeIngredients.sort())) {
      setMessage(`Congratulations! You made a ${currentRecipe}!`);
      setScore(score + 1);
      // Reset the game for the next round
      const newRecipe = getRandomRecipe();
      setCurrentRecipe(newRecipe);
      setRecipeIngredients(recipes[newRecipe]);
      setSelectedIngredients([]);
    } else {
      setMessage(`Incorrect. Try again to make a ${currentRecipe}.`);
    }
  };

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    if (soundtrackRef.current) {
      soundtrackRef.current.muted = newMuteState;
    }
    if (selectSoundRef.current) {
      selectSoundRef.current.muted = newMuteState;
    }
    if (deselectSoundRef.current) {
      deselectSoundRef.current.muted = newMuteState;
    }
  };

  return (
    <div className="container">
      <audio ref={soundtrackRef} src={`${process.env.PUBLIC_URL}/soundtrack.mp3`} loop></audio>
      <audio ref={selectSoundRef} src={`${process.env.PUBLIC_URL}/select-sound.mp3`}></audio>
      <audio ref={deselectSoundRef} src={`${process.env.PUBLIC_URL}/deselect-sound.mp3`}></audio>
      {!gameStarted ? (
        <div className="welcome-screen" onClick={startGame}>
          <h1>Press Click to Start</h1>
        </div>
      ) : (
        <>
          <h2 className="cocktail-text">Cocktail to make: {currentRecipe}</h2>
          <div className="scoreboard">Score: {score}</div>
          <div className="ingredients-grid">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.name}
                className={`ingredient ${selectedIngredients.includes(ingredient.name) ? 'selected' : ''}`}
                onClick={() => handleIngredientClick(ingredient)}
              >
                <img src={ingredient.image} alt={ingredient.name} className="ingredient-image" />
              </div>
            ))}
          </div>
          <div className="text-center my-4">
            <button className="btn btn-primary" onClick={handleSubmit}>
              Submit
            </button>
            {message && <p className="mt-3">{message}</p>}
          </div>
        </>
      )}
      <button className="mute-button" onClick={toggleMute}>
        <img src={isMuted ? `${process.env.PUBLIC_URL}/images/unmute.png` : `${process.env.PUBLIC_URL}/images/mute.png`} alt="Mute/Unmute" />
      </button>
    </div>
  );
};

export default CocktailGame;
