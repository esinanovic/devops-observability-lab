Système d'Alerting & Notifications

Pour garantir une haute disponibilité, le laboratoire inclut une gestion automatique des incidents via Alertmanager.
Architecture des Alertes

    Seuils de détection : Définis dans alert_rules.yml. Actuellement, une alerte critical se déclenche si le backend est injoignable pendant plus de 60 secondes (up == 0).

    Gestion des notifications : Alertmanager réceptionne les alertes, les groupe pour éviter le spam, et les envoie vers un canal Slack dédié.

Exemple de Notification Slack

    [FIRING] Le Backend est hors service ! Description : Le container backend ne répond plus depuis plus d'une minute. Statut : CRITICAL

Comment tester l'alerte ?

    Éteindre le service : docker compose stop backend

    Observer l'alerte passer en état PENDING puis FIRING sur http://localhost:9090/alerts.

    Vérifier la réception du message sur Slack.

    Rallumer le service : docker compose start backend pour recevoir la notification de résolution.