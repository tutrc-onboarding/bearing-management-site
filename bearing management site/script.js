
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

    document.getElementById("quantity").value = "";
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

    values.forEach(function (value) {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
    });

    return row;
}