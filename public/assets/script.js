document.addEventListener("DOMContentLoaded", () => {
    console.log("Here");
    const forms = document.querySelectorAll("#calender_table form");

    forms.forEach(form => {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const firstInput = form.querySelector(".first_input").value;
            const secondInput = form.querySelector(".second_input").value;

            const iValue = form.querySelector(".day_i").value; // i index
            const jValue = form.querySelector(".hour_j").value; // j index

            // Log extracted values for debugging
            // console.log("Extracted values:", {
            //     first: firstInput,
            //     second: secondInput,
            //     i: iValue,
            //     j: jValue
            // });

            const payload = {
                first: firstInput,
                second: secondInput,
                i: iValue,
                j: jValue
            };

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error("Failed to send data");

                const result = await response.json();
                //console.log("✅ Server response:", result);

            } catch (error) {
                console.error("❌ Error sending shift data:", error);
            }
        });
    });
});
