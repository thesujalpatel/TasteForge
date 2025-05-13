"use client";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosCloseCircle } from "react-icons/io";
import ingredientSuggestions from "../static/suggestions";

export default function HomePage() {
  const [ingredients, setIngredients] = useState([]);
  const [input, setInput] = useState("");
  const [diet, setDiet] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    if (cooldown === 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleInputChange = (e) => {
    let value = e.target.value;
    const separators = /[,\s]/g;

    // Check if user typed a separator at the end
    if (separators.test(value)) {
      const parts = value.split(separators).filter(Boolean);
      const uniqueParts = parts.filter(
        (part) => !ingredients.includes(part.toLowerCase())
      );

      if (uniqueParts.length) {
        setIngredients((prev) => [
          ...prev,
          ...uniqueParts.map((p) => p.toLowerCase()),
        ]);
      }
      setInput(""); // clear input
    } else {
      setInput(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      const value = input.trim().toLowerCase();
      if (!ingredients.includes(value)) {
        setIngredients((prev) => [...prev, value]);
      }
      setInput("");
    } else if (e.key === "Backspace" && !input && ingredients.length) {
      setIngredients((prev) => prev.slice(0, -1));
    }
  };

  const handleBlur = () => {
    const trimmed = input.trim().toLowerCase();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients((prev) => [...prev, trimmed]);
    }
    setInput("");
  };

  const removeTag = (index) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTagClick = (tag) => {
    if (!ingredients.includes(tag.toLowerCase())) {
      setIngredients((prev) => [...prev, tag.toLowerCase()]);
    }
  };

  const handleSubmit = async () => {
    if (loading || cooldown > 0) {
      return; // Prevent submissions during loading or cooldown
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients,
          diet: diet.trim(),
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.recipe) {
        setRecipe(data.recipe);
        setTimeout(() => {
          window.scrollTo({
            top: document.querySelector("#recipe")?.offsetTop - 100 || 0,
            behavior: "smooth",
          });
        }, 100);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to fetch recipe.");
      setLoading(false);
    }

    setCooldown(10); // Set cooldown for 10 seconds
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  };

  return (
    <motion.main {...fadeIn} className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-primary font-[family-name:var(--font-courgette)]">
        🍛 Taste Forge
      </h1>
      <p className="text-lg mb-4 text-center text-foreground/50 font-[family-name:var(--font-courgette)]">
        Flavor. Invented. Instantly.
      </p>
      <div className="mb-5">
        <div className="flex flex-wrap gap-2 overflow-x-auto p-2 mb-2 justify-center">
          {Object.keys(ingredientSuggestions).map((category) => (
            <motion.button
              key={category}
              onClick={() =>
                setActiveCategory((prev) =>
                  prev === category ? null : category
                )
              }
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className={`px-4 py-1 rounded-full text-sm whitespace-nowrap border ${
                activeCategory === category
                  ? "bg-primary text-background border-primary"
                  : "bg-background text-foreground border-foreground/20"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Show items only for active category */}
        {activeCategory && (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex flex-wrap gap-2 justify-center"
          >
            {ingredientSuggestions[activeCategory].map((item) => (
              <motion.div
                whileTap={{
                  scale: 0.98,
                  borderColor: "var(--color-primary)",
                }}
                whileHover={{
                  scale: 1.02,
                  borderColor: "var(--color-primary)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 10,
                }}
                whileFocus={{
                  scale: 1.02,
                  borderColor: "var(--color-primary)",
                }}
                key={item}
                onClick={() => handleTagClick(item)}
                className="px-3 py-1 rounded-full text-sm bg-foreground/10 cursor-pointer border-2 border-transparent text-foreground"
              >
                {item}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 border border-foreground/40 p-2 rounded-md">
        <AnimatePresence>
          {ingredients.map((tag, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-primary/20 border border-primary text-foreground text-sm rounded-full px-2 py-1 flex items-center gap-2 justify-center"
            >
              {tag}

              <IoIosCloseCircle
                onClick={() => removeTag(index)}
                className="text-primary cursor-pointer"
                size={16}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        <input
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          inputMode="text"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          placeholder="Type and press comma or space"
          className="flex-1 min-w-[150px] border-none outline-none p-1 text-foreground bg-background"
        />
      </div>
      <select
        value={diet}
        onChange={(e) => setDiet(e.target.value)}
        className="mt-4 p-2 border border-foreground/40 rounded-md w-full bg-background text-foreground"
      >
        <option value="">Select a dietary preference (optional)</option>
        <option value="vegan">Vegan</option>
        <option value="vegetarian">Vegetarian</option>
        <option value="keto">Keto</option>
        <option value="gluten-free">Gluten-Free</option>
        <option value="high-protein">High-Protein</option>
      </select>
      <motion.div
        whileHover={{
          scale: 1.02,
        }}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 15,
        }}
        onClick={handleSubmit}
        className={`px-3 py-2 bg-primary text-background font-semibold rounded-md mt-4 w-fit min-w-50 text-center ${
          cooldown > 0 || loading
            ? "bg-primary/60 cursor-not-allowed"
            : "cursor-pointer"
        } font-[family-name:var(--font-edu_QLD_Beginner)]`}
      >
        {loading
          ? "Hmm... Cooking..."
          : cooldown > 0
          ? `Wait ${cooldown} Seconds`
          : "Ignite The Forge!"}
      </motion.div>
      {error && (
        <motion.p {...fadeIn} className="text-red-500 mt-4">
          {error}
        </motion.p>
      )}
      {recipe && (
        <motion.div
          {...fadeIn}
          id="recipe"
          className="mt-6 bg-primary/5 border-2 sm:p-10 p-3 border-primary/50 text-foreground font-[family-name:var(--font-edu-sa-beginner)] text-2xl/tight rounded-md tracking-[1px]"
        >
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl text-primary my-4 text-center font-[family-name:var(--font-playwrite)] sm:mb-15 mb-5">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl text-primary mt-6 my-3 font-[family-name:var(--font-playwrite)] ">
                  {children}
                  <div className="border-b border border-b-primary w-full" />
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl text-primary mt-2 font-[family-name:var(--font-playwrite)]">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-foreground">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc ml-10 text-foreground">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal ml-10 text-foreground">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-foreground">{children}</li>
              ),
              hr: () => <hr className="hidden" />,
              strong: ({ children }) => (
                <strong className="text-primary font-normal">{children}</strong>
              ),
            }}
          >
            {recipe.replace(/<think>[\s\S]*?<\/think>/g, "")}
          </ReactMarkdown>
          <div className="mt-10 text-4xl flex justify-end text-primary font-[family-name:var(--font-monsieur-la-doulaise)]">
            <div className="-rotate-6 w-fit font-bold">- Taste Forge</div>
          </div>
        </motion.div>
      )}
    </motion.main>
  );
}
