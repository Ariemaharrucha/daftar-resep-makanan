import { IRecipe } from "./types/entity";
import { getData } from "./libs/fetch";

const API_URL = "https://v1.appbackend.io/v1/rows/FcO2lxYAqVZ6";

interface IRecipeResult {
  data: IRecipe[];
}

async function renderRecipes() {
  try {
    const result = await getData<IRecipeResult>(API_URL);

    if (!result) {
      throw new Error("Error ");
      return;
    }

    result.data.map((food) => {
      const listRecipes = document.getElementById("list-recipes");
      const card = document.createElement("div");
      const bodyRecipe = document.createElement("div");
      const bodyTimes = document.createElement("div");

      const title = document.createElement("p");
      const recipes = document.createElement("p");
      const times = document.createElement("span");
      const categories = document.createElement("p");
      const btnDelete = document.createElement('button');

      const textRecipe = document.createElement('h5').textContent = 'Resep makanan :';
      const textTimes = document.createElement('span').textContent = 'Waktu masak :';

      card.classList.add('card');
      title.classList.add('title');
      bodyRecipe.classList.add('recipes');
      bodyTimes.classList.add('times');
      categories.classList.add('categories');
      // recipes.classList.add('recipes');

      title.textContent = food.name;
      recipes.textContent = food.recipe;
      times.textContent = food.time_cook;
      categories.textContent = food.category;
      btnDelete.textContent = 'hapus';
      btnDelete.dataset.id = food._id;

      btnDelete.addEventListener('click',async function() {
        try {
          await deleteRecipe(food._id);
          
        } catch (error) {
          console.log(error);
          
        }
      })

      bodyRecipe.append(textRecipe, recipes)
      bodyTimes.append(textTimes, times)
      card.append(title, bodyRecipe , bodyTimes , categories, btnDelete);
      listRecipes?.appendChild(card);
    });
  } catch (error) {
    console.log(error);
  }
};

renderRecipes();

document
  .getElementById("add-recipe")
  ?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name") as HTMLInputElement;
    const category = document.getElementById("category") as HTMLInputElement;
    const recipe = document.getElementById("recipe") as HTMLInputElement;
    const time_cook = document.getElementById("time_cook") as HTMLInputElement;

    // console.log(`name: ${name.value}, category: ${category.value}, recipe: ${recipe.value}, time_cook: ${time_cook.value}`);

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{
          name: name.value,
          category: category.value,
          recipe: recipe.value,
          time_cook: time_cook.value,
        }]),
      });
    } catch (error) {
      console.log(error);
    } finally {
      window.location.reload();
    }
  });


async function deleteRecipe(id:string) {
  // console.log(id);
  if(confirm('apakah anda ingin menghapus resep ini') == true) {
    try {
      const res = await fetch(`${API_URL}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{id}])
      });   
      if (!res.ok) {
        throw new Error("error");
      }
    } catch (error) {
      console.log(error);
    } finally {
      window.location.reload();
    }
  }
  return;
}


function cardElement(_id: string, name: string, recipe: string, time_cook: string, category: string){
  return `<div class="card">
  <p class="title">${name}</p>
  <div class="recipes">
    <h5>Resep makanan :</h5>
    <p>${recipe}</p>
  </div>
  <div class="times">
    <span>Waktu memasak :</span>
    <span>${time_cook}</span>
  </div>
  <div class="categories">${category}</div>
  <button type="button" dataset-id="${_id}">hapus</button>
</div>`
}