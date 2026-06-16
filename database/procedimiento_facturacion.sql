-- =========================================================
-- Procedimiento almacenado: facturación por especialidad
-- Visto en clase práctica 10/06/2026
-- Calcula, para cada especialidad activa, la cantidad de
-- turnos y la facturación total del MES ANTERIOR a la fecha
-- actual, considerando solo turnos activos.
-- =========================================================

DELIMITER //

DROP PROCEDURE IF EXISTS sp_facturacion_por_especialidad //

CREATE PROCEDURE sp_facturacion_por_especialidad()
BEGIN
    SELECT
        e.id_especialidad,
        e.nombre AS especialidad,
        COUNT(tr.id_turno_reserva) AS cantidad_turnos,
        COALESCE(SUM(tr.valor_total), 0) AS facturacion_total
    FROM especialidades e
    LEFT JOIN medicos m
        ON e.id_especialidad = m.id_especialidad
    LEFT JOIN turnos_reservas tr
        ON m.id_medico = tr.id_medico
        AND MONTH(tr.fecha_hora) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)
        AND tr.activo = 1
    WHERE e.activo = 1
    GROUP BY e.id_especialidad, e.nombre
    ORDER BY cantidad_turnos DESC;
END //

DELIMITER ;

-- Prueba manual:
-- CALL sp_facturacion_por_especialidad();
