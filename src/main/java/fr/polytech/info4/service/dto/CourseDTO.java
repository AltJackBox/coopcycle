package fr.polytech.info4.service.dto;

import java.io.Serializable;
import java.time.Duration;
import java.util.Objects;

/**
 * A DTO for the {@link fr.polytech.info4.domain.Course} entity.
 */
public class CourseDTO implements Serializable {

    private Long id;

    private Duration deliveryTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Duration getDeliveryTime() {
        return deliveryTime;
    }

    public void setDeliveryTime(Duration deliveryTime) {
        this.deliveryTime = deliveryTime;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CourseDTO)) {
            return false;
        }

        CourseDTO courseDTO = (CourseDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, courseDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CourseDTO{" +
            "id=" + getId() +
            ", deliveryTime='" + getDeliveryTime() + "'" +
            "}";
    }
}
