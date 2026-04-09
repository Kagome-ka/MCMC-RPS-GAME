let pilihan = ["gunting", "batu", "kertas"]


let gunting = 0
let batu = 0
let kertas = 0

let gunting_b = 0
let batu_b = 0
let kertas_b = 0
let skor_p = 0
let skor_b = 0
let seri = 0
let main_game = 0

let last_move = null

let transisi = {
    "gunting": { "gunting": 0, "batu": 0, "kertas": 0 },
    "batu": { "gunting": 0, "batu": 0, "kertas": 0 },
    "kertas": { "gunting": 0, "batu": 0, "kertas": 0 }
}

function prediksi_markov(last_move) {
    if (last_move === null) {
        return pilihan[Math.floor(Math.random() * 3)]
    }

    let kemungkinan = transisi[last_move]
    let total = kemungkinan.gunting + kemungkinan.batu + kemungkinan.kertas

    if (total === 0) {
        return pilihan[Math.floor(Math.random() * 3)]
    }

    return Object.keys(kemungkinan).reduce((a, b) =>
        kemungkinan[a] > kemungkinan[b] ? a : b
    )
}

function resetGame() {
    skor_p = 0
    skor_b = 0
    seri = 0
    main_game = 0
    gunting = 0
    batu = 0
    kertas = 0

    gunting_b = 0
    batu_b = 0
    kertas_b = 0

    last_move = null

    transisi = {
        "gunting": { "gunting": 0, "batu": 0, "kertas": 0 },
        "batu": { "gunting": 0, "batu": 0, "kertas": 0 },
        "kertas": { "gunting": 0, "batu": 0, "kertas": 0 }
    }

    document.getElementById("hasil").innerText = "🔄 Game berhasil direset!"
    document.getElementById("skor").innerText = ""
    document.getElementById("persen").innerText = ""
}

function tampilkanPopup(text) {
    document.getElementById("popupText").innerText = text
    document.getElementById("popup").style.display = "flex"
}

function tutupPopup() {
    document.getElementById("popup").style.display = "none"
}

function menyerah() {
    if (main_game === 0) {
        document.getElementById("hasil").innerText = "Belum ada permainan 😅"
        return
    }

    let persen_p = ((skor_p / main_game) * 100).toFixed(1)
    let persen_b = ((skor_b / main_game) * 100).toFixed(1)

    document.getElementById("hasil").innerText =
        "🏳️ Kamu menyerah!"

    document.getElementById("skor").innerText =
        `Final Score: Kamu ${skor_p} - ${skor_b} Komputer`

    document.getElementById("persen").innerText =
        `Winrate: Kamu ${persen_p}% | Komputer ${persen_b}%`

    // SUMMARY 🔥
    tampilkanPopup(
        "Pilihan Kamu:\n" +
        `Gunting: ${gunting}\nBatu: ${batu}\nKertas: ${kertas}\n\n` +

        "Pilihan Komputer:\n" +
        `Gunting: ${gunting_b}\nBatu: ${batu_b}\nKertas: ${kertas_b}\n\n` +

        `Total Game: ${main_game}`
    )

    // Reset setelah lihat hasil
    resetGame()
}

function main(pemain) {

    if (last_move !== null) {
        transisi[last_move][pemain] += 1
    }

    let prediksi = prediksi_markov(last_move)

    let komputer
    if (prediksi === "gunting") komputer = "batu"
    else if (prediksi === "batu") komputer = "kertas"
    else komputer = "gunting"

    let hasil = ""

    // Hitung pilihan pemain
    if (pemain === "gunting") gunting++
    else if (pemain === "batu") batu++
    else if (pemain === "kertas") kertas++

    // Hitung pilihan komputer
    if (komputer === "gunting") gunting_b++
    else if (komputer === "batu") batu_b++
    else if (komputer === "kertas") kertas_b++

    if (pemain === komputer) {
        hasil = "Seri!"
        seri++
    } else if (
        (pemain === "gunting" && komputer === "kertas") ||
        (pemain === "batu" && komputer === "gunting") ||
        (pemain === "kertas" && komputer === "batu")
    ) {
        hasil = "Kamu Menang!"
        skor_p++
    } else {
        hasil = "Kamu Kalah!"
        skor_b++
    }

    main_game++

    // Hitung persentase
    let persen_p = main_game > 0 ? ((skor_p / main_game) * 100).toFixed(1) : 0
    let persen_b = main_game > 0 ? ((skor_b / main_game) * 100).toFixed(1) : 0

    document.getElementById("hasil").innerText =
        `Kamu: ${pemain} | Komputer: ${komputer} → ${hasil}`

    document.getElementById("skor").innerText =
        `Skor: Kamu ${skor_p} - ${skor_b} Komputer | Total: ${main_game}`

    document.getElementById("persen").innerText =
        `Winrate: Kamu ${persen_p}% | Komputer ${persen_b}%`

    last_move = pemain
}
