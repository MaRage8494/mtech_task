// Функция для обработки данных их файла .csv
const processData = function (csv) {
  // Разделение строк CSV и обработка данных
  const rows = csv.split("\r\n");
  const headers = rows[0].split(",");
  const data = [];

  for (let i = 1; i < rows.length; i++) {
    let rowData = rows[i].replace(/\\/g, "").split('"');
    rowData = rowData[0]
      .split(",")
      .concat(rowData[1])
      .filter((element) => element !== "");

    // Удаляем лишнюю строку
    if (rowData[0] === "") continue;
    // Проверяем на соответствие элементов в массиве с количеством заголовков и создаём объект, где ключ это заголовок
    else if (rowData.length === headers.length) {
      const obj = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j].trim()] = rowData[j].trim();
      }
      data.push(obj);
    }
  }

  // Сохранение данных в LocalStorage
  localStorage.setItem("csvData", JSON.stringify(data));
};

// Отображение экрана просмотра данных
const showDataScreen = function () {
  const mainScreen = document.getElementById("main-screen");
  const dataScreen = document.getElementById("data-screen");

  // Скрытие главного экрана и показ экрана с полученной таблицей
  mainScreen.classList.add("hidden");
  dataScreen.classList.remove("hidden");

  // Добавляем функционал на кнопку "Загрузить новый файл"
  const loadDataButton = document.getElementById("load-new-file");
  loadDataButton.addEventListener("click", function () {
    // Очищаем локальное хранилище
    localStorage.removeItem("csvData");
    // Обновляем страницу
    location.reload();
  });

  // Вызов функции заполнения таблицы
  displayDataInTable();
};

// Метод для преобразование номера в формат +7 xxx xxx xx xx
function formatNumber(obj) {
  for (let i = 0; i < obj.length; i++) {
    for (let [key, value] of Object.entries(obj[i])) {
      if (key === "phone") {
        let formattedNumber =
          value.slice(0, 2) +
          " " +
          value.slice(2, 5) +
          " " +
          value.slice(5, 8) +
          " " +
          value.slice(8, 10) +
          " " +
          value.slice(10);
        obj[i]["phone"] = formattedNumber;
      }
    }
  }
  return obj;
}

// Отображение данных в таблице
const displayDataInTable = function () {
  // Получение данных из локального хранилища
  const data = formatNumber(JSON.parse(localStorage.getItem("csvData")));
  const table = document.getElementById("data-table");

  if (data && data.length > 0) {
    const headers = Object.keys(data[0]);
    const headerRow = document.createElement("tr");

    // Создаём заголовки таблицы
    ["Имя", "Номер телефона", "email", "Дата рождения", "Адрес"].forEach(
      (header) => {
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
      }
    );

    table.appendChild(headerRow);

    // Создвние элементов таблицы и их заполнение
    data.forEach((item) => {
      const row = document.createElement("tr");
      headers.forEach((header) => {
        const cell = document.createElement("td");
        cell.textContent = item[header];
        row.appendChild(cell);
      });
      table.appendChild(row);
    });
  }
};

// Активируем загрузку файлов через input с помощью клика на кнопку на экране загрузки
document
  .querySelector(".main-button")
  .addEventListener("click", () => document.querySelector(".input").click());

// Добавляем слушатель на загрузку файла
document
  .getElementById("file-input")
  .addEventListener("change", function (event) {
    const file = event.target.files[0]; // Получение загруженного файла
    if (file && file.name.endsWith(".csv")) {
      // Проверяем наличие файла и является он с расширением .csv иначе выйдет ошибка
      // Чтение содержимого CSV-файла
      const reader = new FileReader();
      reader.onload = function (e) {
        const csv = e.target.result;
        processData(csv); // Функция для обработки данных
        showDataScreen(); // Функция для отображения экрана с таблицей
      };
      // Выставляем кодировку windows-1251 тк при utf-8 неккоректно выводит результат
      reader.readAsText(file, "windows-1251");
    } else {
      // Вывод сообщения об ошибке загрузки данных
      const errorMessage = document
        .getElementById("error-message");
      errorMessage.classList.remove("hidden")
      errorMessage.textContent = "Неправильный формат файла, разрешены только файлы .CSV";
    }
  });

  // Проверка сохраненных данных в LocalStorage при загрузке страницы
window.onload = function () {
  const savedData = localStorage.getItem("csvData");
  if (savedData) {
    showDataScreen();
  }
};
