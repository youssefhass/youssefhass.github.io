<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Portfolio - Contact Me</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Contact Me</h1>
    </header>
    <nav>
        <!-- Navigation links here -->
    </nav>

    <main>
        <section id="contact" class="section">
            <h2>Contact Me ✉️</h2>
            <!-- Contact form pointing to the same page for processing -->
            <form id="contactForm" action="contact.php" method="POST">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>

                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>

                <label for="subject">Subject:</label>
                <input type="text" id="subject" name="subject" required>

                <label for="message">Message:</label>
                <textarea id="message" name="message" rows="5" required></textarea>

                <button type="submit">Send Message</button>
            </form>

            <?php
            if ($_SERVER["REQUEST_METHOD"] == "POST") {
                $name = htmlspecialchars(trim($_POST["name"]));
                $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
                $subject = htmlspecialchars(trim($_POST["subject"]));
                $message = htmlspecialchars(trim($_POST["message"]));

                if (empty($name) || empty($email) || empty($subject) || empty($message)) {
                    echo "<p>All fields are required.</p>";
                } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    echo "<p>Invalid email format.</p>";
                } else {
                    $to = "contact@youssefhassan.com"; 
                    $email_subject = "New message from $name: $subject";
                    $email_body = "Name: $name\nEmail: $email\n\nMessage:\n$message\n";
                    $headers = "From: $email\r\nReply-To: $email\r\n";

                    if (mail($to, $email_subject, $email_body, $headers)) {
                        echo "<p>Thank you! Your message has been sent.</p>";
                    } else {
                        echo "<p>Oops! Something went wrong, and we couldn’t send your message.</p>";
                    }
                }
            }
            ?>
        </section>
    </main>

    <footer>
        <!-- Footer content here -->
    </footer>
</body>
</html>
