import { IRecipe } from "./types/entity";
import { getData } from "./libs/fetch";

const API_URL = "https://v1.appbackend.io/v1/rows/FcO2lxYAqVZ6";

interface IRecipeResult {
  data: IRecipe[];
}

const nameFood = document.getElementById("name") as HTMLInputElement;

nameFood?.addEventListener("input", function () {
  const value = nameFood.value;
  if (value.length > 0) {
    nameFood.value =
      value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
});

async function renderRecipes() {
  try {
    const result = await getData<IRecipeResult>(API_URL);

    if (!result) {
      throw new Error("Error ");
      return;
    }

    const listRecipes = document.getElementById("list-recipes");

    result.data.map((food) => {
      listRecipes?.insertAdjacentHTML(
        "beforeend",
        cardElement(
          food._id,
          food.name,
          food.recipe,
          food.time_cook,
          food.category
        )
      );
    });

    listRecipes?.addEventListener("click", async function (event) {
      const target = event.target as HTMLElement;
      console.log(target);
      const btnDelete = target.closest(".btnDelete");
      const btnEdit = target.closest(".btnDetail")
      if (btnDelete) {
        try {
          await deleteRecipe(target.dataset.id as string);
        } catch (error) {
          console.log(error);
        }
      } else if (btnEdit) {
        console.log('tes');
        
      }
    });
  } catch (error) {
    console.log(error);
  }
}

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
        body: JSON.stringify([
          {
            name: name.value,
            category: category.value,
            recipe: recipe.value,
            time_cook: time_cook.value,
          },
        ]),
      });
    } catch (error) {
      console.log(error);
    } finally {
      window.location.reload();
    }
  });

async function deleteRecipe(id: string) {
  console.log(id);
  if (confirm("apakah anda ingin menghapus resep ini") == true) {
    try {
      const res = await fetch(`${API_URL}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{ id }]),
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

function cardElement(
  _id: string,
  name: string,
  recipe: string,
  time_cook: string,
  category: string
) {
  return `<div class="card">
  <p class="title">${name}</p>
  <div class="recipes">
    <h4>Resep makanan :</h4>
    <p>${recipe}</p>
  </div>
  <div class="footer-card">
    <div class="times">
      <span>Waktu memasak :</span>
      <span>${time_cook}</span>
    </div>
    <div class="btn-list">
      <button type="button" class="btnDelete" data-id="${_id}">hapus</button>
      <button type="button" class="btnDetail" disabled >
        Cara masak
      </button>
    </div>
  </div>
  <div class="categories">${category}</div>
</div>`;
} 