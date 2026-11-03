
const bearings = JSON.parse(localStorage.getItem("bearings")) || [];
bearings.forEach(function (bearing) {
    const list = document.getElementById("bearing-rows");
    const item = createBearingRow(bearing);

    item.dataset.notes = bearing.notes;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "削除";

    deleteButton.addEventListener("click", function () {
        if (confirm("この在庫を削除しますか？")) {
            const index = bearings.indexOf(bearing);
            bearings.splice(index, 1);
            localStorage.setItem("bearings", JSON.stringify(bearings));
            item.remove();
            filterBearings();
        }
    });

    const actionCell = document.createElement("td");
    actionCell.appendChild(deleteButton);
    item.appendChild(actionCell);
    list.appendChild(item);
});

const registerButton = document.getElementById("register");
const flangeSelect = document.getElementById("flange");
const flangeFields = document.getElementById("flange-fields");
flangeSelect.addEventListener("change", function () {
    flangeFields.hidden = (flangeSelect.value !== "あり");
});


//登録ボタンが押されたときの処理
registerButton.addEventListener("click", function () {
    //idから入力値を取得
    const inner = document.getElementById("inner").value;
    const outer = document.getElementById("outer").value;
    const width = document.getElementById("width").value;
    const flange = document.getElementById("flange").value;
    const flangeOuter = document.getElementById("flange_outer").value;
    const flangeWidth = document.getElementById("flange_width").value;
    const notes = document.getElementById("notes").value;
    const quantity = document.getElementById("quantity").value;

    //入力値がおかしくないか確認
    if (inner === "" || outer === "" || width === "" || quantity === "") {
        alert("内径、外径、厚さ、在庫数は必須項目です。");
        return;
    }
    if (Number(outer) <= Number(inner)) {
        alert("外径は内径より大きくしてください");
        return;
    }
    if (Number(inner) <= 0 || Number(outer) <= 0 || Number(width) <= 0) {
        alert("内径、外径、厚さは0より大きい数で入力してください");
        return;
    }
    if (!Number.isInteger(Number(quantity)) || Number(quantity) < 0) {
        alert("在庫数は0以上の整数で入力してください");
        return;
    }
    if (flange === "あり") {
        if (flangeOuter === "" || flangeWidth === "") {
            alert("フランジの外径と厚さを入力してください");
            return;
        }
        if (Number(flangeOuter) <= Number(outer)) {
            alert("フランジ外径は外径より大きくしてください");
            return;
        }
        if (Number(flangeOuter) <= 0 || Number(flangeWidth) <= 0) {
            alert("フランジの外径、厚さは0より大きい数で入力してください");
            return;
        }
    }

    //在庫情報をまとめる
    const bearing = {
        inner: inner,
        outer: outer,
        width: width,
        flange: flange,
        flangeOuter: flangeOuter,
        flangeWidth: flangeWidth,
        notes: notes,
        quantity: quantity
    };
    //在庫情報を配列に追加
    bearings.push(bearing);

    localStorage.setItem("bearings", JSON.stringify(bearings));


    //削除ボタンの作成
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "削除";

    deleteButton.addEventListener("click", function () {
        if (confirm("この在庫を削除しますか？")) {
            const index = bearings.indexOf(bearing);
            if (index !== -1) {
                bearings.splice(index, 1);
                localStorage.setItem("bearings", JSON.stringify(bearings));
            }
            item.remove();
            filterBearings();
        }
    });


    //在庫一覧に追加
    const list = document.getElementById("bearing-rows");
    const item = createBearingRow(bearing);
    item.dataset.notes = notes;

    const actionCell = document.createElement("td");
    actionCell.appendChild(deleteButton);
    item.appendChild(actionCell);
    list.appendChild(item);
    filterBearings();

    // 登録が成功したら入力欄を空にする
    const inputIds = [
        "inner", "outer", "width",
        "flange_outer", "flange_width",
        "notes", "quantity"
    ];

    inputIds.forEach(function (id) {
        document.getElementById(id).value = "";
    });

    // フランジを「なし」に戻す
    flangeSelect.value = "なし";
    flangeFields.hidden = true;

    // 次の入力を始める位置へ戻す
    document.getElementById("inner").focus();
});

//検索欄の処理
const searchInner = document.getElementById("search-inner");
const searchOuter = document.getElementById("search-outer");
const searchWidth = document.getElementById("search-width");
const searchFlange = document.getElementById("search-flange");
const searchNotes = document.getElementById("search-notes");

function filterBearings() {
    const items = document.querySelectorAll("#bearing-rows tr");
    items.forEach(function (item) {
        const innerMatchs = searchInner.value === "" || Number(item.dataset.inner) === Number(searchInner.value);
        const outerMatchs = searchOuter.value === "" || Number(item.dataset.outer) === Number(searchOuter.value);
        const widthMatchs = searchWidth.value === "" || Number(item.dataset.width) === Number(searchWidth.value);
        const flangeMatchs = searchFlange.value === "" || item.dataset.flange === searchFlange.value;
        const notesMatchs = item.dataset.notes.includes(searchNotes.value.trim());
        item.hidden = !(innerMatchs && outerMatchs && widthMatchs && flangeMatchs && notesMatchs);
    });

    const visiblecount = Array.from(items).filter(function (item) {
        return !item.hidden;
    }).length;

    if (visiblecount === 0) {
        document.getElementById("result-count").textContent = "条件に一致する在庫はありません。";
    } else {
        document.getElementById("result-count").textContent = "検索結果: " + visiblecount + "件";
    }
}

searchInner.addEventListener("input", filterBearings);
searchOuter.addEventListener("input", filterBearings);
searchWidth.addEventListener("input", filterBearings);
searchFlange.addEventListener("change", filterBearings);
searchNotes.addEventListener("input", filterBearings);

const clearSearchButton = document.getElementById("clear-search");
clearSearchButton.addEventListener("click", function () {
    searchInner.value = "";
    searchOuter.value = "";
    searchWidth.value = "";
    searchFlange.value = "";
    searchNotes.value = "";
    filterBearings();
});
filterBearings();

//在庫一覧の行を作成する関数
function createBearingRow(bearing) {
    const row = document.createElement("tr");
    row.dataset.inner = bearing.inner;
    row.dataset.outer = bearing.outer;
    row.dataset.width = bearing.width;
    row.dataset.flange = bearing.flange;
    row.dataset.notes = bearing.notes;
    const values = [
        bearing.inner,
        bearing.outer,
        bearing.width,
        bearing.flange,
        bearing.flange === "あり" ? bearing.flangeOuter : "-",
        bearing.flange === "あり" ? bearing.flangeWidth : "-",
        bearing.notes,
        bearing.quantity
    ];

    values.forEach(function (value, cellIndex) {
        const cell = document.createElement("td");
        cell.textContent = value;
        if (cellIndex === 7) {
            cell.classList.add("quantity-cell");
            cell.title = "ダブルクリックで在庫数を変更";

            cell.addEventListener("dblclick", function () {
                const input = prompt("新しい在庫数を入力してください", bearing.quantity);

                if (input === null) {
                    return;
                }

                if (input.trim() === "" || !Number.isInteger(Number(input)) || Number(input) < 0) {
                    alert("在庫数は0以上の整数にしてください");
                    return;
                }

                bearing.quantity = String(Number(input));
                localStorage.setItem("bearings", JSON.stringify(bearings));
                cell.textContent = bearing.quantity;

                cell.style.color = Number(bearing.quantity) === 0 ? "#be123c" : "";
                cell.style.fontWeight = Number(bearing.quantity) === 0 ? "bold" : "";
            });
        }
        if (cellIndex === 7 && Number(bearing.quantity) === 0) {
            cell.style.color = "#be123c";
            cell.style.fontWeight = "bold";
        }
        row.appendChild(cell);
    });

    return row;
}


// バックアップの保存と復元の処理
const exportButton = document.getElementById("export-data");

exportButton.addEventListener("click", function () {
    const data = JSON.stringify(bearings, null, 2);
    const file = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(file);

    const link = document.createElement("a");
    link.href = url;
    const now = new Date();

    const timestamp = now.getFullYear()
        + "-" + String(now.getMonth() + 1).padStart(2, "0")
        + "-" + String(now.getDate()).padStart(2, "0")
        + "_" + String(now.getHours()).padStart(2, "0")
        + "-" + String(now.getMinutes()).padStart(2, "0")
        + "-" + String(now.getSeconds()).padStart(2, "0");

    link.download = "bearing-backup_" + timestamp + ".json";

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(function () {
        URL.revokeObjectURL(url);
    }, 1000);
});

const importInput = document.getElementById("import-data");

importInput.addEventListener("change", async function () {
    const file = importInput.files[0];

    if (!file) {
        return;
    }

    try {
        const text = await file.text();
        const importedBearings = JSON.parse(text);

        if (!Array.isArray(importedBearings)) {
            alert("在庫一覧の形式ではありません");
            return;
        }

        const requiredKeys = [
            "inner", "outer", "width", "flange",
            "flangeOuter", "flangeWidth", "notes", "quantity"
        ];

        const valid = importedBearings.every(function (bearing) {
            return bearing !== null
                && typeof bearing === "object"
                && requiredKeys.every(function (key) {
                    return typeof bearing[key] === "string";
                });
        });

        if (!valid) {
            alert("在庫データの項目が正しくありません");
            return;
        }
        const confirmed = confirm(
            "現在の在庫を、バックアップの"
            + importedBearings.length
            + "件に置き換えますか？"
        );

        if (!confirmed) {
            return;
        }

        localStorage.setItem("bearings", JSON.stringify(importedBearings));
        location.reload();

    } catch (error) {
        alert("ファイルを読み取れませんでした。バックアップファイルを確認してください");
    } finally {
        importInput.value = "";
    }
}
);
